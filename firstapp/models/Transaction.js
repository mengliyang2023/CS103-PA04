
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var transSchema = Schema( {
  description:String,
  category: String,
  amount:Number,
  date: Date,
  delete: String,
  edit: String,
  itemId: {type:ObjectId, ref:'transaction' }
} );

module.exports = mongoose.model( 'Transaction', transSchema );
