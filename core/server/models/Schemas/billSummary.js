var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 
 var BillSummarySchema = new Schema ( {
  dublinCore:{
      attributes:{
          xmlnsdc:String
      },
      text:String,
      dcFormat:{
          text:String
      },
      dcLanguage:{
          text:String
      },
      dcRights:{
          text:String
      },
      dcContributor:{
          text:String
      },
      dcDescription:{
          text:String
      }
  },item:{
   attributes:{
     congress: String,
     measureType: String,
     measureNumber: Number,
     measureId :String,
     originChamber: String,
     origPublishDate: Date,
     updateDate: Date
   },
     text: String,
     title:{
         text: String
     },
     summary:{
      attributes:{
          summaryid: String,
          currentChamber:String,
          updatedate:Date
      },
      text:String,
      actiondate:{
          text:Date
      },
      actiondesc:{
          text:String
      },
      summarytext:{
          cdatasection:String
      }
    }
  }
 } );

module.exports.billSummaryModel = mongoose.model('BillSummaries', BillSummarySchema);