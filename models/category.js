//MONGOOSE MODEL CONFIG 
var mongoose = require("mongoose")

var categorySchema = new mongoose.Schema({
    title: String, 
    blogs:  [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Blog"
        }
     ]
})


// Category.create({
//     title: "Political"
// }, function(err, category){
//     if(err){
//         console.log(err); 
//     } else {
//         console.log(category); 
//     }
// }); 

module.exports = mongoose.model("Category", categorySchema)