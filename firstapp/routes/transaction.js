/*
  transaction.js -- Router for the transaction
*/
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User')


isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
  }

router.get('/transaction',
  isLoggedIn, 
  async (req, res, next) => {
    const show = req.query.show
    const completed = show=='completed'
    let items = []
    items = await Transaction.find({itemId: req.category._id})
    res.render('transaction.ejs',{items})
  });

router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transact = new Transaction(
        {description:req.body.description,
         category: req.body.category,
         amount: req.body.amount,
         date: new Date(),
         delete: req.body.delete,
         edit: req.body.edit
        })
      await transact.save();
      res.redirect('/transaction')
});


router.get('/transaction/byCategory',
  isLoggedIn,
  async (req, res, next) => {
      const item = 
      await Transaction.findById(req.params.category);
      res.locals.item = item
      res.render('bycategory.ejs')
  });
   

router.get('?sortBy=category',
isLoggedIn,
async (req, res, next) => {
    let results =
          await Transaction.aggregate(
              [ 
                {$group:{
                  _id:'$category',
                  total:{$count:{}}
                  }},
                {$sort:{total:-1}},              
              ])
            
      results = 
         await User.populate(results,
          {path:'_id',
          select:['category','amount']})
      res.render('bycategory.ejs',{results})
});


router.get('/?sortBy=amount',
isLoggedIn,
async (req, res, next) => {
    let results =
          await Transaction.aggregate(
              [ 
                {$group:{
                  _id:'$amount',
                  total:{$count:{}}
                  }},
                {$sort:{total:-1}},              
              ])
            
      results = 
         await User.populate(results)
      res.render('amount.ejs',{results})
});


router.get('/?sortBy=description',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await Transaction.aggregate(
                [ 
                  {$group:{
                    _id:'$description',
                    total:{$count:{}}
                    }},
                  {$sort:{total:-1}},              
                ])
              
        results = 
          await User.populate(results)
        res.render('description.ejs',{results})
  });


router.get('/transaction/edit/',
  isLoggedIn,
  async (req, res, next) => {
      const item = 
       await ToDoItem.findById(req.params.itemId);
      res.locals.edit = edit
      res.render('edit')
});

router.post('/transaction/edit/',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId, description,amount,category} = req.body;
      await ToDoItem.findOneAndUpdate(
        {_id:itemId},
        {$set: {description,amount,category,}} );
      res.redirect('/transaction')
});


module.exports = router;
