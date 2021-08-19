let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.error(e);
}
const {Schema} = mongoose;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 1 }
});

const counter = mongoose.model('counter', CounterSchema);

const ShorturlSchema = mongoose.Schema({
    original_url: {type: String},
    short_url: {type: Number}
});

counter.find({ _id: 'shorturlId' }, function(err, doc){
  if(err){
    console.error(err);
  }
  if(doc.length == 0){
    let c = new counter({
      _id: 'shorturlId'
    })
    c.save(function(err, data){
      if(err) {
        console.error(err);
        return;
      }
      console.log('initialized counter!',{data});
    });
  }
})

ShorturlSchema.pre('save', function(next) {
    let doc = this;
    counter.findByIdAndUpdate({_id: 'shorturlId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.short_url = counter.seq;
        next();
    });
});

let ShortUrl = mongoose.model('ShortUrl',ShorturlSchema);

module.exports = { mongoose, Schema, ShortUrl }
