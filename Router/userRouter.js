var express = require('express');
var router = express.Router();
const otpgenerator = require("otp-generator")
const userSchema = require('../Models/userSchema')
const productSchema = require('../Models/productSchema')
const productdetailsSchema = require('../Models/productDetailsSchema')
const sellSchema = require('../Models/sellSchema')
const advancebookingSchema = require('../Models/advancebookingSchema')
const cartSchema = require('../Models/cartSchema')
const multer = require('multer')
const moment = require('moment')
const pdf = require('pdfkit')
const fs = require('fs')




// otp create
const otpfun  = () => {

    const otp =   otpgenerator.generate(6, { 
        digits: true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false,
    });
    return otp 
}

// generate invoice pdf
function createInvoice(invoice, path) {
    try {
        
        let doc = new pdf({ margin: 50 });
    
        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        generateInvoiceTable(doc, invoice);
        // generateFooter(doc);
    
        doc.end();
        doc.pipe(fs.createWriteStream(`./public/pdf/${invoice.invoicenumber}.pdf`));
    } catch (error) {
        console.log(error)
    }
}

function generateHeader(doc) {
	doc
        // .text('LOGO', 50, 45, { width: 50 })
        .image(`./public/logo/logo.png`, 50, 35, { width: 60 })
		.fillColor('#444444')
		.fontSize(20)
		.text('Glads limited', 0, 57 , { align: 'center' })
		.fontSize(10)
		.text('123 Mp nagar', 480, 65, )
		.text('Bhopal, M.P, 462022', 450, 80, )
        .moveTo(50, 100)
        .lineTo(550, 100)
        .stroke()
		.moveDown()
        .fontSize(28)
        .text('Invoice', 50, 135)
}

function generateCustomerInformation(doc, invoice) {
	doc
        .fontSize(10)
        .moveTo(50, 170)
        .lineTo(550, 170)
        .stroke()
        .text(`Invoice Number: ${invoice.invoicenumber}`, 50, 190)
		.text(`Invoice Date: ${invoice.buyeddate}`, 50, 205)
		.text(`Balance Due: Rs ${invoice.remainingamount}`, 50, 220)
        .moveTo(50, 250)
        .lineTo(550, 250)
        .stroke()
        .fontSize(10)
        .text('Customer Name :- ', 380, 190)
		.text(`${invoice.buyername}`, 470, 190)
        .text('Customer Phone :- ', 380, 220)
        .text(`${invoice.buyerphone}`, 470, 220)
		.moveDown();
}

function generateInvoiceTable(doc, invoice) {
	// let i,
		invoiceTableTop = 330;
console.log(invoice)

	// for (i = 0; i < invoice.items.length; i++) {
	// 	const item = invoice.items[i];
	// 	const position = invoiceTableTop + (i + 1) * 30;
	// 	generateTableRow(
	// 		doc,
	// 		position,
	// 		item.item,
	// 		item.description,
	// 		item.amount / item.quantity,
	// 		item.quantity,
	// 		item.amount,
	// 	);
	// }
}


// store the file in the public/image directory and create a unique filename for each
const storagedata = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      // console.log(file);
      const unique = Date.now() + 'glads' + Math.floor(Math.random() * 100000) + `${file.originalname}`
      cb(null, unique)
    }
  })

// filter the file before upload
function fileFilter(req, file, cb) {
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') {
    cb(null, true)
  } else {
    cb(null, false)
    cb(new Error('Only image files are allowed!'))
  }
}

const upload = multer({
    storage: storagedata,
    fileFilter: fileFilter,
  })


//  imgarr   
const imgarr = (data) => {
    data.forEach(element => {
        console.log(`../public/images/uploads/${element.filename}`)   
      return `../public/images/uploads/${element.filename}`  
    })
}




/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('login page')
});

// signup
router.post('/signup', async function(req, res, next) {
 const user2 = new userSchema(req.body);
 user2.otp.otpnum = otpfun();
 await user2.save()
 res.send(user2);
})

// login
router.post('/login', async function(req, res, next) {
 try {
   const userotp = await userSchema.findOne({
        phone : req.body.phone,
    })
    // userotp.otp.otpnum = otpfun();
    // console.log(userotp.otp.otpnum)
    if(userotp.otp.otpnum ===  req.body.otp){
        res.send(userotp)
        // await userotp.save()
    }
    else{
        res.send("user not found")
    }
 } catch (error) {
    res.send(error)
 }
    
})

//create product only admin routes
router.post('/createproduct', async function(req, res, next) {
    try {
        const product = new productSchema(req.body);
        await product.save()
        res.send(product)
    } catch (error) {
        res.send(error)
    }
}
)

// create product details`
router.post('/createproductdetails/:id', async function(req, res, next) {
//    find product and then create product details
    try {
    //    find product
        const {id} = req.params;
        const product = await productSchema.findById(id);
        // create product details
        const productdetails = new productdetailsSchema(req.body);
        product.details = productdetails;
        await product.save()
        await productdetails.save()
        // res.send(productdetails)
        res.send({product, productdetails});
    } catch (error) {
        res.send(error)
    }
}
)

// find all products
router.get('/products', async function(req, res, next) {
    try {
        const products = await productSchema.find().populate('details')
        res.send(products)
    } catch (error) {
        res.send(error)
    }
}
)

// find product by id
router.get('/product/:id', async function(req, res, next) {
    try {
        const product = await productSchema.findById(req.params.id).populate('details')
        res.send(product)
    } catch (error) {
        res.send(error)
    }
}
)
// add to cart product
router.post('/addtocart/:id', async function(req, res, next) {
    const {id} = req.params;
    const {quantity} = req.body;
    try {
        const product = await productSchema.findById(id);
        const cart = cartSchema.push({
            product: product,
            quantity: quantity
        });
        await cart.save()
        res.send(cart)
    }
    catch (error) {
        res.send(error)
    }
}

)

// find cart by id
router.get('/cart/:id', async function(req, res, next) {
    try {
        const cart = await cartSchema.findById(req.params.id).populate('product')
        res.send(cart)
    } catch (error) {
        res.send(error)
    }
}
)



// sell product by id and update the product details
router.post('/sellproduct/:id', async function(req, res, next) {
    try {
        const sellproduct = new sellSchema(req.body);
        const { id } = req.params;
        const product = await productSchema.findById(id);
         const productdetails = await productdetailsSchema.findById(product.details._id);
         if (req.body.buyedquantity > productdetails.quantity) res.send(`not enough quantity the available quantity is ${productdetails.quantity}`)
         else{
            productdetails.quantity = productdetails.quantity - req.body.buyedquantity; 
            sellproduct.buyedproductname = product.name;
            sellproduct.buyedproductid = product._id;
            sellproduct.buyedproduct.push(product._id);
            sellproduct.remainingamount=  req.body.buyedprice - req.body.paidamount;
            sellproduct.buyeddate = moment().format('MMMM Do YYYY, h:mm:ss a');
            await productdetails.save()     // update the quantity in product details
            await product.save()       // update the quantity in product
            await sellproduct.save()
            createInvoice(sellproduct)
            res.send({product,sellproduct})
        }
    } catch (error) {
        res.send(error)
    }
})


// find all sell products
router.get('/sellproducts', async function(req, res, next) {
    try {
        const sellproducts = await sellSchema.find().populate(' buyedproduct')
        res.send(sellproducts)
    } catch (error) {
        res.send(error)
    }
}
)


// update product details
router.patch('/updateproductdetails/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const product = await productSchema.findById(id);
        const productdetails = await productdetailsSchema.findById(product.details._id);
        productdetails.quantity = productdetails.quantity + req.body.quantity;
        productdetails.price = req.body.price;
        await productdetails.save()
        await product.save()
        res.send(productdetails)
    } catch (error) {
        res.send(error)
    }
}
)

// delete product details
router.delete('/deleteproduct/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const product = await productSchema.findById(id);
        await product.remove()
        res.send(product)
    } catch (error) {
        res.send(error)
    }
}
)

// advance booking product by id and update in advance booking
router.post('/advancebookingproduct/:id', async function(req, res, next) {
   try {
        const advancebooking = new advancebookingSchema(req.body);
        const bookedbywho = req.body.bookedbywho;
        const phone = req.body.phone;
        advancebooking.bookedbywho = bookedbywho;
        advancebooking.phone = phone;
        // 
         const { id } = req.params;
    const product = await productSchema.findById(id);
    // 
    advancebooking.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    advancebooking.bookedproductname = product.name;
    advancebooking.bookedproductid = product._id;
    advancebooking.bookedquantity = req.body.quantity;
    advancebooking.totalamount = req.body.totalamount;
    advancebooking.paidamount = req.body.paidamount;
    advancebooking.remainingamount = req.body.totalamount - req.body.paidamount;
    // 
    await advancebooking.save()
    await product.save()
    res.send({product,advancebooking})   
   } catch (error) {
    
   }
})

// find all advance booking
router.get('/advancebooking', async function(req, res, next) {
    try {
        const advancebooking = await advancebookingSchema.find().populate('bookedproductid')
        res.send(advancebooking)
    } catch (error) {
        res.send(error)
    }
}
)

// find advance booking by id
router.get('/advancebooking/:id', async function(req, res, next) {
    try {
        const advancebooking = await advancebookingSchema.findById(req.params.id).populate('bookedproductid')
        res.send(advancebooking)
    } catch (error) {
        res.send(error)
    }
}
)

router.put("/updateadvancebooking/:id",(async (req, res) => {
      const data = await advancebookingSchema.findById(req.params.id);
      console.log("jeetul", data);
      if (data === null) {
        res.send("There is no data in add new details");
      } else {
        const newData = {
          ...data._doc,
          ...req.body,
        };
  
        console.log("myData", newData);
        const insertData = await advancebookingSchema.findByIdAndUpdate(
          req.params.id,
          newData,
          { new: true }
        );
        await res.status(200).send(insertData);
      }
    })
);

// sell products of advancebooking
router.post('/sellproduct/advancebooking/:advancebookingid', async function(req, res, next) {
    try {
        const {advancebookingid} = req.params 
        const advancebooking = await advancebookingSchema.findById(advancebookingid);
        console.log(advancebooking);
        const sellSchemaadv = new sellSchema(req.body);
        const product = await productSchema.findById(advancebooking.bookedproductid);
        const productdetails = await productdetailsSchema.findById(product.details._id);
        if (advancebooking.bookedquantity > productdetails.quantity) res.send(`not enough quantity , the available quantity is ${productdetails.quantity}`)
        else{
            sellSchemaadv.buyername = advancebooking.bookedbywho;
            sellSchemaadv.buyerphone = advancebooking.phone;
            sellSchemaadv.buyedproductname = advancebooking.bookedproductname;
            sellSchemaadv.buyedproductid = advancebooking.bookedproductid;
            sellSchemaadv.remainingamount=  advancebooking.totalamount - advancebooking.paidamount;
            sellSchemaadv.buyedquantity = advancebooking.bookedquantity;
            productdetails.quantity = productdetails.quantity - advancebooking.bookedquantity;
            sellSchemaadv.buyeddate = moment().format('MMMM Do YYYY, h:mm:ss a');
            sellSchemaadv.paidamount = advancebooking.paidamount;
            sellSchemaadv.buyedprice = advancebooking.totalamount;
        }
        await productdetails.save()
        await product.save()
        // await advancebooking.remove()
        await sellSchemaadv.save()
        // console.log(product)
        console.log(sellSchemaadv)
        createInvoice(sellSchemaadv)
        res.send({product,sellSchemaadv})


    } catch (error) {
        res.send(error)
    }
}
)



module.exports = router;
