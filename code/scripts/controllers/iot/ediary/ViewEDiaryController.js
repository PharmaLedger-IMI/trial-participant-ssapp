import EDiaryService from "../../../services/iot/EDiaryService.js";

const { WebcController } = WebCardinal.controllers;
//function formatDate(data.date) {
   // let date = new Date(),
    //    month = '' + (date.getMonth() + 1),
     //   day = '' + date.getDate(),
     //   year = date.getFullYear();

   // if (month.length < 2)
   //     month = '0' + month;
   // if (day.length < 2)
   //     day = '0' + day;

   // return [year, month, day].join('-');
//}

export default class ViewEdiaryController extends WebcController {
    constructor(...props) {
        super(...props);

        let uid=this.history.location.state.uid;
        this.EDiaryService = new EDiaryService();

     this.EDiaryService.getEdiary(uid,(err, data) => {
            if (err) {
                return console.log(err);
            }
            //data.stringDate = new Date(data.date).toLocaleString();
            let year=new Date(data.date).getFullYear();
            let month= new Date(data.date).getMonth() + 1;
            let day=new Date(data.date).getDate();
            //console.log("ziua"+day);
            //console.log("luna"+month);
            //console.log("anul"+year);
            if (month <= 9)
           // console.log("add 0 to month");
           month = '0' + month;
            
            if (day <= 9)
           // console.log("add 0 to month");
           day = '0' + day;

            //console.log('_________________________');
            //console.log("ziua"+day);
            //console.log("luna"+month);
            //console.log("anul"+year);
            data.stringDate = [year, month, day].join('-');
            this.model.ediary = data;
            
       });
    
        this._addHandlerBack();
        

    }
    _addHandlerBack() {

        this.onTagClick('ediary:back', () => {
        this.navigateToPageTag('iot-ediary');

        });

    }
    
}