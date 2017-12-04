/* global require:true, console:true, process:true, __dirname:true */
'use strict'
/**
 * Created by hanwang on 1/23/17.
 */

// Group ID,Reg No.,FF,First Name,Last Name,LF,DoB,Sex,Race,Reg No.,First Name,Last Name,DoB,Sex,Race,Record ID,type,Same
// 1,1597730921,33,VIRGINIA,FOX,211,11/07/1945, F, W,1597730921,********,***,11/07/****, *, *, 35,  1,  1
// 0,         1, 2,       3,  4,  5,         6, 7, 8,         9,      10, 11,        12,13,14, 15, 16,  1

var title = ["Pair","ID","FFreq","First name","Last name","LFreq","DoB(M/D/Y)","Sex","Race","ID."];
var cwidth = [60,150,60,150,150,150,125,60,60,80]; //870
var height = 24; //height per row 0 30 57
var ys = [0,30,77];
//index mapping from hidden data to visible data per row
var mapping = [0,9,2,10,11,5,12,13,14,1,3,4,6,7,8,15];
var data = {}; // experimentr data
var key_value ="";//show opened items
var key_value_prev ="";//show previous opened items
var key_value_sib = "";
var key_value_sib_prev = "";
var n_pair = 0;
var s2_n_pair = 0;
var swap_switch=0;
var mode_list = ["Partial", "Partial_Cell", "Opti1", "Full"];
var privacy_score_decrement = 0;
var privacy_score_decrement_sib = 0;
var current_privacy = 100;

/**
 * draw a cell
 * x,y : position
 * cx,cy : size
 * t : text (string)
 * c : color
 * g : div in HTML
 * j : id
 * k : cell type
 * cell type = {
 *      0:group id hidden
 *      1:title
 *      2:group id visible
 *      3:default data cell
 *      4:merged cell unclickable
 *      5:merged cell hidden
 *      6:clickable data cell
 *      9:hidden data
 *      }
 */

var total_char=0;
// console.log(experimentr.data()["section2"][0][0][1][1]); //this is pair 1, row 2, column 1 which is 1000142704
// calculate total number of characters on a page
// coloumn 1,2,3 6,7,8 are the ones with information needed
// There are 5 column
for(var m=0;m<6;m++){
    for(var i=0;i<9;i++){
        if(i!=0&&i!=2&&i!=5) {
            var line_1 = experimentr.data()["section2"][0][m][0][i];
            var line_2 = experimentr.data()["section2"][0][m][1][i];


            // console.log(line_1.length);
            // console.log(line_2);
            // console.log(line_2.length);
            total_char = total_char+line_1.length+line_2.length;
        }
    }
}
console.log(total_char,"total char is");
total_char = total_char - 22;//the number is 377
console.log("total number of characters is : ",total_char);
var char_disclosed = 0;

if(true) {
//     {
//        // "L:SWANSON#D:05/16/1961": 1000,
//         //"F:ALEXANDRA#D:05/04/1994#S:F#R:W": 2000
//     };//todo: load json properly

// $.getJSON("modules/rareset.json", function(json) {
//     console.log(json); // this will show the info it in firebug console
// });


    var json_load = document.createElement('script');
    json_load.src = "/modules/rareset.js";
    document.head.appendChild(json_load);
    console.log(json_load);
    //console.log(json_content);
    var comb_array = [];
}
//console.log(json_content["F:EMMA"]);
//var json_content = JSON.stringify(json_file);
function findInJason(json_cont){

    for (var i = 0; i < json_cont.length; i++){
        // look for the entry with a matching `code` value


        // if (json_cont[i].code == p_name){
        //     console.log("found");
        // }
    }

}

//findInJason(json_content);

var current_progress_1;
function changeBar(total_char, char_disclosed) {
    var current_progress_1;
    current_progress_1 = char_disclosed/total_char*100;
    $("#sum")
        .css("width", current_progress_1 + "%")
        .attr("aria-valuenow", current_progress_1).css("vertical-align","middle");
    $("#real_progress_value")
        .text(char_disclosed + " of "+total_char+ " ("+current_progress_1.toFixed(1) + "%) ").css("font-size", "150%").css("color", "black").css("transform"," translateY(25%)").css("transform"," translateX(-5%)") ;

    experimentr.data()["current_progress"] = current_progress_1;
    return current_progress_1;
};

function preCalculatedPercentageBar(total_char, char_disclosed) {
    var new_progress_1;
    new_progress_1 =char_disclosed/total_char*100;

    $("#dynamic")
        .css("width", new_progress_1 + "%")
        .attr("aria-valuenow", new_progress_1).css("vertical-align","middle");
    $("#dynamic_privacy")
        .css("width", new_progress_1 + "%")
        .attr("aria-valuenow", new_progress_1).css("vertical-align","middle");
    $("#potential_privacy")
        .text( "Potential Change:"+new_progress_1.toFixed(1)).append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        ""+"Potential Change:"+new_progress_1.toFixed(1)).css("font-size", "100%").css("color", "#f0ad4e").css("transform"," translateY(60%)").css("transform"," translateX(5%)") ;
        // .text("potential change is:" + char_disclosed + "\n"+"(" + new_progress_1.toFixed(1) + "%) ").css("font-size", "100%").css("color", "red").css("transform"," translateY(22%)") ;
    $("#change_value")
        .text( "Percent of Characters Disclosed").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        ""+"Privacy Budget Used").css("font-size", "115%").css("color", "black").css("transform"," translateY(60%)").css("transform"," translateX(6%)") ;

};


function changePrivacy(current_privacy,deltaK) {
    //console.log("current privacy is", current_privacy);
    $("#sum_privacy")
        .css("width", 100-current_privacy + "%")
        .attr("aria-valuenow", 100-current_privacy).css("vertical-align","middle");
    $("#progress_value_privacy")
        // .text(""+current_privacy.toFixed(1) + "% ").css("font-size", "100%").css("color", "black").css("transform"," translateY(22%)") ;
        .text(""+(100-current_privacy).toFixed(0) + " of 100 "+"("+(100-current_privacy).toFixed(1) + "%)").css("font-size", "150%").css("color", "black").css("transform"," translateY(22%)").css("transform"," translateX(-5%)") ;
    experimentr.data()["current_privacy"] = current_privacy;

};

var swap_count=0;
function cell(t,g,j,k, mode)
{
    // console.log(t);


    // if(title[j%cwidth.length]=="ID"){
    //     console.log("ID");
    //     console.log("t",t);
    //     console.log("g",g);
    //     console.log("j",j);
    //     console.log("j",k);
    // }
    //
    // if(title[j%cwidth.length]=="ID."){
    //     console.log("IDdot");
    //     console.log("t",t);
    //     console.log("g",g);
    //     console.log("j",j);
    //     console.log("k",k);
    // }
    // erase title columns
    changeBar(total_char, char_disclosed);
    preCalculatedPercentageBar(total_char, 0);
    changePrivacy(current_privacy, privacy_score_decrement);
    //changePrivacy(current_privacy, privacy_score_decrement_sib);
   // console.log("clickable.js in the working");
    var index_r = g.attr("id").slice(1)%6;
    var x = 40*(j%cwidth.length)+cwidth.slice(0,j%cwidth.length).reduce((a, b) => a + b, 0),
        y = index_r==0&&j>=cwidth.length ? ys[Math.floor(j/cwidth.length)]+20 : ys[Math.floor(j/cwidth.length)],

        cx = cwidth[j%cwidth.length],
        cy = height ;

    var cel = g.append("g").attr("id","c"+j.toString()).attr("class","cell").attr("data-mode",mode)
        .attr("transform","translate("+x+","+y+")").on('click',function() {

           //clickfunctionstart
           //  experimentr.data()["current_cel"] = d3.select(this);
           //  var bg = div

            if(experimentr.data()["clickable"] == "true" && cel.attr("missing") != "true") {

                // console.log(d3.select(this).attr("id"));
                // console.log(d3.select(this.parentNode).attr("id"));
                var cell_question_number = d3.select(this).attr("id");//findId
                var question_number=cell_question_number.replace("c", " ");
                var cell_pair_number = d3.select(this.parentNode).attr("id");
                var pair_number = cell_pair_number.replace("g", " ");
                //console.log(question_number);
                var pair_num =parseInt(pair_number );
                // console.log(pair_number);

                var prev_text_id = parseInt(question_number);
                var sibling_id;
                if(prev_text_id<20){
                    sibling_id = "c"+(prev_text_id +10).toString();
                }
                else if(prev_text_id>20){
                    sibling_id = "c"+(prev_text_id -10).toString();
                 }
                //console.log(sibling_id);


                var prev_text = d3.select(this).text();
                var prev_text_sibling = d3.select(this.parentNode).select("#"+sibling_id).text();
                //console.log(prev_text);
                //console.log(prev_text_sibling);

                var original_text;
                var original_text_sibling;
                var pageNumber = parseInt(experimentr.data()["current_question_page"] - 1);
                if(question_number<20){
                   original_text = experimentr.data()["section2"][pageNumber][pair_num%6][0][question_number-10];
                   original_text_sibling = experimentr.data()["section2"][pageNumber][pair_num%6][1][question_number-10];
                    //console.log(original_text);

                }
                else if(question_number >20){
                    original_text = experimentr.data()["section2"][pageNumber][pair_num%6][1][question_number-20];
                    original_text_sibling = experimentr.data()["section2"][pageNumber][pair_num%6][0][question_number-20];
                    //console.log(original_text);

                }
                //console.log("clicked quesiton number is",question_number);
                //prev_text,prev_text_sibling are what's on the screen
                // original_text are original_text_sibling the final text

                //original_text_sibling = original_text_sibling.toString();
                var char_difference=0;
                var at_and_count=0;//@,&

                for(var i=0,c=prev_text.length;i<c;i++){
                    if(prev_text[i] != original_text[i]){
                       char_difference +=1;}
                    if(prev_text[i] == "&"||prev_text[i] == "@"){
                        at_and_count += 1;
                    }
                }
                //console.log("char_difference is ", char_difference);
                //console.log("this &@ count is ", at_and_count);
                //console.log("prev_text_sibling is",prev_text_sibling);

               // console.log("original_text_sibling",original_text_sibling);

                for(var i=0,c=prev_text_sibling.length;i<c;i++){

                    if(prev_text_sibling[i] != original_text_sibling[i]){
                        char_difference +=1;}
                    if(prev_text_sibling[i] == "&"||prev_text_sibling[i] == "@"){
                        at_and_count += 1;
                    }
                }
               // console.log("total char_difference is ", char_difference);
                //console.log("plus sibling's &@ count is ", at_and_count);
                if(at_and_count != 0){
                char_difference = at_and_count;
                }
                if(prev_text == " " && prev_text_sibling == " "){
                    char_difference = original_text.length * 2;
                }
                //d3.select(this).attr("id");
              //  console.log(d3.select(this).attr("id"));
                if(d3.select(this).attr("id")=="c10"||d3.select(this).attr("id")=="c12"||d3.select(this).attr("id")=="c15"
                ||d3.select(this).attr("id")=="c22"||d3.select(this).attr("id")=="c25"){
                    char_difference= 0;
                }

                if(prev_text == "@@@@@" || prev_text == "&&&&&&&&&&&"||prev_text=="&&&&&@&&&&&" ){
                    swap_count+=1;
                    if(swap_count==1){
                    char_difference= 16*2;}
                    else{
                        char_difference=0;
                    }
                }
                if(d3.select(this).attr("id")=="c16" ||d3.select(this).attr("id")=="c26"){
                    if(prev_text == " "){
                    char_difference= 16;}
                    else if(prev_text == "**/**/****"){
                        char_difference = 8;
                    }
                    else if(prev_text == "" &&prev_text_sibling == "**/**/****"){
                        char_difference = 8;
                    }
                    else{
                        char_difference = char_difference;
                    }
                }

                //console.log("char difference is ",char_difference);
                char_disclosed += char_difference;
               // console.log(char_disclosed);
                // for(var i=0,c=original_text.length;i<c;i++){
                //     if(prev_text[i] != original_text[i]){
                //         char_difference +=1;
                //     }
                // }




                // var prev_sib_text = d3.select(this.previousSibling.previousSibling.previousSibling).text();
                // var prev_text = d3.select(this).text();
                // console.log(prev_sib_text);
                // console.log(prev_text);
               // console.log(char_difference);






                changeBar(total_char, char_disclosed);



                if (j > 10) {
                    var current_mode = cel.attr("data-mode");

                if ((((current_mode == "Partial") || (current_mode == "Partial_Cell")) && (["ID", "First name", "Last name", "DoB(M/D/Y)", "Sex", "Race"].indexOf(title[j % cwidth.length]) >= 0) && (j > 9))) {

                    if (j > 20) {
                        var row_num = 1;
                        var j2 = j - 10;
                        var otcell = "#c" + (j - 10);

                    } else {
                        var row_num = 0;
                        var j2 = j + 10;
                        var otcell = "#c" + (j + 10);
                    }

                    var x = d3.select(this.parentNode);

                    //show opened cell; now all the current text on the screen; ignore the pictures
                    var json_content ={
                        "I:#D:09/29/1978":1,
                        "I:#L:GAILYA#D:09/29/1978":1,
                        "I:#D:09/29/1978#R:W":1,
                        "I:#R:W":1,
                        "I:#S:F":1,
                        "I:#L:GAILYA":1,
                        " ":1,
                        "I:#D:09/29/1978#S:F":1,
                        "I:#L:OMONDI#D:09/29/1978": 1,
                        "F:ERNESTO#L:PEDROZA SR": 1,
                        "L:SWANSON#D:05/16/1961": 1,
                        "F:ALEXANDRA#D:05/04/1994#S:F#R:W": 1,
                        "F:GAILYA#D:09/29/1978#R:W": 1,
                        "I:1742668281#R:W": 1,
                        "I:1742682819#F:SARA": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#D:05/21/1988": 1,
                        "F:ALEXANDER#L:BROST#R:W": 1,
                        "I:1777743278#F:ALEXANDRA#S:F": 1,
                        "L:OMONDI#D:09/29/1978": 1,
                        "F:ALEXANDER#S:M#R:W": 1,
                        "F:SARA#S:F": 2,
                        "I:9320952205": 2,
                        "I:9320952205#F:EMMA#L:BRIGGS#D:12/29/1987": 1,
                        "I:1742668281#L:STYLES-BOONE#R:W": 1,
                        "F:EMMA#L:BRIGGS": 1,
                        "I:1299747019#F:ERNESTO#S:M#R:O": 1,
                        "F:ERNESTO#L:PEDROZA SR#D:04/19/1964#S:M#R:O": 1,
                        "I:1299747019#S:M": 1,
                        "F:GAILYA#R:W": 1,
                        "L:BRIGGS#R:W": 1,
                        "F:ERNESTO#L:PEDROZA JR#R:O": 1,
                        "F:ERNESTO#D:07/23/1997": 1,
                        "I:1742668281#D:05/21/1988#S:F#R:W": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#S:M#R:B": 1,
                        "D:05/16/1961#S:M": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#D:05/21/1988#S:F#R:W": 1,
                        "D:05/21/1988#S:F": 2,
                        "D:05/16/1916#R:B": 1,
                        "I:1742682819#F:SARA#S:F": 1,
                        "I:1299747019#S:M#R:O": 1,
                        "F:SARA#L:STYLES-BOONE#S:F#R:W": 1,
                        "L:BRIGGS#D:12/29/1987#S:F": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#S:F": 1,
                        "I:1777743279#F:ALEXANDER#D:05/04/1994#S:M#R:W": 1,
                        "L:SWANSON#S:M#R:B": 2,
                        "F:SARA#D:05/21/1988#R:W": 2,
                        "F:ERNESTO#L:PEDROZA JR#D:07/23/1997#R:O": 1,
                        "D:12/29/1987": 2,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#D:04/19/1964#S:M#R:O": 1,
                        "F:SARA#D:05/21/1988#S:F#R:W": 2,
                        "F:SARA#L:STYLES-BOONE#D:05/21/1988": 1,
                        "I:6456839076#L:PEDROZA JR#R:O": 1,
                        "I:1742682819#L:BOONE#D:05/21/1988#R:W": 1,
                        "I:1777743278#L:BROST#S:F": 1,
                        "I:1777743279#S:M#R:W": 1,
                        "F:SARA#L:BOONE#D:05/21/1988#R:W": 1,
                        "L:SWANSON#D:05/16/1961#S:M": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#R:B": 1,
                        "F:ALEXANDER#L:BROST#D:05/04/1994#S:M#R:W": 1,
                        "I:1299747019#F:ERNESTO#D:04/19/1964#S:M#R:O": 1,
                        "F:ERNESTO#D:04/19/1964": 1,
                        "I:1299747019#D:04/19/1964#R:O": 1,
                        "I:1777743278#F:ALEXANDRA#D:05/04/1994#S:F#R:W": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1961#S:M": 1,
                        "L:BROST#S:F#R:W": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON": 1,
                        "F:EMMA#L:DEYTON#S:F": 1,
                        "L:DEYTON#S:F#R:W": 1,
                        "F:ALEXANDER#D:05/04/1994#R:W": 1,
                        "I:1742682819#L:BOONE#S:F#R:W": 1,
                        "F:GAILYA#L:OMONDI#D:09/29/1978": 1,
                        "F:ALEXANDRA#L:BROST#R:W": 1,
                        "F:OMONDI#L:GAILYA#S:F": 1,
                        "L:STYLES-BOONE": 1,
                        "I:5678412359#R:B": 1,
                        "I:9320952205#D:12/29/1987#S:F": 2,
                        "I:1777743279#F:ALEXANDER#L:BROST#S:M": 1,
                        "S:M#R:W": 1,
                        "I:5678412359#L:SWANSON#D:05/16/1961#R:B": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#D:07/23/1997#S:M#R:O": 1,
                        "I:4897541253#L:SWANSON#S:M#R:B": 1,
                        "S:M#R:B": 4,
                        "F:EMMA#L:BRIGGS#D:12/29/1987#S:F": 1,
                        "D:07/23/1997#S:M": 1,
                        "F:RUFORD#D:05/16/1916#S:M": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1916#S:M#R:B": 1,
                        "I:5678412359#L:SWANSON": 1,
                        "S:M#R:O": 2,
                        "L:STYLES-BOONE#S:F#R:W": 1,
                        "I:1742668281#L:STYLES-BOONE": 1,
                        "F:ALEXANDRA#S:F#R:W": 1,
                        "L:GAILYA#D:09/29/1978": 1,
                        "F:GAILYA#L:OMONDI#S:F#R:W": 1,
                        "F:ALEXANDER#L:BROST": 1,
                        "L:BROST#R:W": 2,
                        "F:RUFORD#L:SWANSON#D:05/16/1916": 1,
                        "I:5678412359#F:RUFORD#R:B": 1,
                        "I:1856554310#L:OMONDI#D:09/29/1978#S:F#R:W": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#D:05/16/1916#S:M": 1,
                        "F:ALEXANDER#S:M": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#S:M": 1,
                        "I:9320952205#L:BRIGGS#R:W": 1,
                        "L:SWANSON": 2,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR": 1,
                        "I:1742682819#D:05/21/1988#S:F": 1,
                        "F:EMMA#L:BRIGGS#D:12/29/1987#S:F#R:W": 1,
                        "I:4897541253#D:05/16/1916#S:M#R:B": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#S:F#R:W": 1,
                        "I:9320952205#L:BRIGGS#D:12/29/1987#S:F": 1,
                        "L:OMONDI#D:09/29/1978#S:F": 1,
                        "F:OMONDI#D:09/29/1978#S:F#R:W": 1,
                        "I:1742668281#L:STYLES-BOONE#S:F#R:W": 1,
                        "I:1742668281#L:STYLES-BOONE#D:05/21/1988#R:W": 1,
                        "F:ALEXANDER#R:W": 1,
                        "F:EMMA#L:DEYTON#D:12/29/1987": 1,
                        "I:1777743279#F:ALEXANDER#S:M#R:W": 1,
                        "I:1299747019#D:04/19/1964#S:M#R:O": 1,
                        "L:DEYTON#S:F": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#D:12/29/1987#R:W": 1,
                        "L:STYLES-BOONE#S:F": 1,
                        "L:GAILYA#D:09/29/1978#R:W": 1,
                        "F:ERNESTO#L:PEDROZA SR#R:O": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#D:05/04/1994#R:W": 1,
                        "I:9320952205#L:BRIGGS#D:12/29/1987#S:F#R:W": 1,
                        "I:1777743278#D:05/04/1994#R:W": 1,
                        "I:5678412359#L:SWANSON#S:M#R:B": 1,
                        "I:9320952205#L:DEYTON#D:12/29/1987#S:F#R:W": 1,
                        "I:1742682819#F:SARA#L:BOONE#S:F#R:W": 1,
                        "I:1856554310#F:GAILYA": 1,
                        "F:SARA#L:BOONE#D:05/21/1988#S:F#R:W": 1,
                        "I:1742682819#F:SARA#L:BOONE#D:05/21/1988": 1,
                        "I:9320952205#L:DEYTON#S:F": 1,
                        "I:4897541253#L:SWANSON#D:05/16/1916#R:B": 1,
                        "F:ALEXANDRA#D:05/04/1994#S:F": 1,
                        "L:PEDROZA SR#S:M": 1,
                        "F:EMMA#R:W": 2,
                        "S:M": 7,
                        "F:RUFORD#L:SWANSON": 2,
                        "S:F": 7,
                        "I:1299747019#F:ERNESTO#S:M": 1,
                        "L:GAILYA#S:F": 1,
                        "I:5678412359#D:05/16/1961": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#D:12/29/1987#R:W": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#D:07/23/1997#S:M": 1,
                        "I:5678412359#F:RUFORD#D:05/16/1961#S:M": 1,
                        "I:1856554310#L:OMONDI#D:09/29/1978": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#R:W": 1,
                        "I:1777743279#L:BROST": 1,
                        "R:B": 4,
                        "I:1777743279#D:05/04/1994#R:W": 1,
                        "R:O": 2,
                        "I:9320952205#F:EMMA#L:DEYTON#S:F": 1,
                        "I:1742682819#F:SARA#L:BOONE": 1,
                        "F:ALEXANDER#L:BROST#D:05/04/1994#S:M": 1,
                        "I:1742668281": 1,
                        "I:1742682819": 1,
                        "F:SARA#D:05/21/1988#S:F": 2,
                        "I:1777743279#F:ALEXANDER#L:BROST#D:05/04/1994": 1,
                        "L:BROST#D:05/04/1994#S:M": 1,
                        "I:1777743278#D:05/04/1994": 1,
                        "L:BROST#D:05/04/1994#S:F#R:W": 1,
                        "F:OMONDI#S:F": 1,
                        "L:PEDROZA SR": 1,
                        "F:RUFORD#L:SWANSON#S:M#R:B": 2,
                        "I:1742682819#F:SARA#S:F#R:W": 1,
                        "I:1777743278#L:BROST#D:05/04/1994#S:F": 1,
                        "D:12/29/1987#R:W": 2,
                        "D:05/04/1994": 2,
                        "I:6456839076#L:PEDROZA JR#D:07/23/1997#S:M": 1,
                        "I:1742668281#S:F": 1,
                        "L:BOONE#D:05/21/1988#R:W": 1,
                        "F:ERNESTO#D:07/23/1997#S:M": 1,
                        "I:4897541253#F:RUFORD#D:05/16/1916": 1,
                        "I:1856554310#D:09/29/1978#S:F": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS": 1,
                        "L:PEDROZA SR#D:04/19/1964#S:M#R:O": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#S:M": 1,
                        "I:9320952205#L:DEYTON#D:12/29/1987#S:F": 1,
                        "L:OMONDI#S:F#R:W": 1,
                        "F:OMONDI#L:GAILYA#S:F#R:W": 1,
                        "L:DEYTON#D:12/29/1987#R:W": 1,
                        "R:W": 8,
                        "I:6456839076#D:07/23/1997#R:O": 1,
                        "I:1742682819#L:BOONE#D:05/21/1988": 1,
                        "I:6456839076#F:ERNESTO#S:M#R:O": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#D:04/19/1964#S:M": 1,
                        "I:1742682819#L:BOONE#S:F": 1,
                        "L:SWANSON#D:05/16/1961#S:M#R:B": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#D:05/16/1961#S:M#R:B": 1,
                        "L:BROST#D:05/04/1994": 2,
                        "I:9320952205#F:EMMA#R:W": 2,
                        "F:EMMA#D:12/29/1987#R:W": 2,
                        "I:1856554310#F:GAILYA#L:OMONDI#R:W": 1,
                        "L:BRIGGS#S:F": 1,
                        "F:ERNESTO#S:M#R:O": 2,
                        "F:ALEXANDRA#R:W": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1916#R:B": 1,
                        "L:BOONE#S:F#R:W": 1,
                        "D:05/21/1988": 2,
                        "L:SWANSON#D:05/16/1961#R:B": 1,
                        "D:05/16/1916": 1,
                        "F:ALEXANDRA#L:BROST": 1,
                        "I:1856554310#L:OMONDI#R:W": 1,
                        "F:ERNESTO#L:PEDROZA SR#D:04/19/1964#R:O": 1,
                        "L:PEDROZA JR#D:07/23/1997#S:M": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#S:M#R:B": 1,
                        "F:EMMA": 2,
                        "I:4897541253#F:RUFORD#D:05/16/1916#S:M#R:B": 1,
                        "L:SWANSON#D:05/16/1916#S:M#R:B": 1,
                        "F:EMMA#L:DEYTON#D:12/29/1987#R:W": 1,
                        "I:1742668281#F:SARA#S:F": 1,
                        "F:EMMA#L:BRIGGS#D:12/29/1987": 1,
                        "I:9320952205#D:12/29/1987": 2,
                        "F:SARA#L:STYLES-BOONE#S:F": 1,
                        "I:4897541253#F:RUFORD#R:B": 1,
                        "L:BROST#S:M": 1,
                        "L:BROST#S:F": 1,
                        "L:PEDROZA JR#S:M#R:O": 1,
                        "I:1742682819#D:05/21/1988#S:F#R:W": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#D:04/19/1964": 1,
                        "F:RUFORD#L:SWANSON#R:B": 2,
                        "I:1299747019#F:ERNESTO#D:04/19/1964#R:O": 1,
                        "I:1777743278#L:BROST#S:F#R:W": 1,
                        "L:PEDROZA JR": 1,
                        "I:1856554310#F:GAILYA#D:09/29/1978#S:F": 1,
                        "I:1777743279#L:BROST#S:M": 1,
                        "L:OMONDI#S:F": 1,
                        "F:RUFORD#R:B": 2,
                        "I:1299747019#F:ERNESTO": 1,
                        "I:4897541253#S:M#R:B": 1,
                        "D:04/19/1964#S:M": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#D:05/16/1961#S:M": 1,
                        "I:4897541253#L:SWANSON#D:05/16/1916": 1,
                        "D:05/16/1916#S:M": 1,
                        "L:DEYTON#D:12/29/1987": 1,
                        "I:6456839076#F:ERNESTO#D:07/23/1997#R:O": 1,
                        "L:GAILYA#D:09/29/1978#S:F#R:W": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#D:05/21/1988#S:F": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#D:09/29/1978": 1,
                        "L:BROST#S:M#R:W": 1,
                        "F:GAILYA#D:09/29/1978#S:F": 1,
                        "I:9320952205#F:EMMA#D:12/29/1987#R:W": 2,
                        "F:GAILYA#L:OMONDI#R:W": 1,
                        "I:1777743279#D:05/04/1994#S:M": 1,
                        "I:9320952205#D:12/29/1987#S:F#R:W": 2,
                        "I:1856554310#L:OMONDI#D:09/29/1978#R:W": 1,
                        "F:ERNESTO#D:07/23/1997#S:M#R:O": 1,
                        "I:5678412359#L:SWANSON#D:05/16/1961": 1,
                        "D:09/29/1978#R:W": 2,
                        "F:OMONDI#L:GAILYA#D:09/29/1978#R:W": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST#D:05/04/1994#R:W": 1,
                        "L:STYLES-BOONE#D:05/21/1988#S:F#R:W": 1,
                        "L:BROST": 2,
                        "L:GAILYA#D:09/29/1978#S:F": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#D:07/23/1997#R:O": 1,
                        "F:ALEXANDRA#L:BROST#D:05/04/1994#R:W": 1,
                        "I:1777743279#L:BROST#D:05/04/1994#S:M#R:W": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#R:W": 1,
                        "F:OMONDI#L:GAILYA": 1,
                        "I:1742668281#D:05/21/1988#S:F": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST": 1,
                        "I:4897541253#R:B": 1,
                        "I:9320952205#L:BRIGGS": 1,
                        "I:1742682819#R:W": 1,
                        "I:1777743279#L:BROST#D:05/04/1994": 1,
                        "F:ALEXANDER#D:05/04/1994": 1,
                        "F:EMMA#L:BRIGGS#S:F": 1,
                        "F:EMMA#L:DEYTON#S:F#R:W": 1,
                        "L:STYLES-BOONE#D:05/21/1988#R:W": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#D:09/29/1978#R:W": 1,
                        "I:5678412359#L:SWANSON#S:M": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#S:F#R:W": 1,
                        "I:1299747019#L:PEDROZA SR#D:04/19/1964#S:M#R:O": 1,
                        "I:6456839076#L:PEDROZA JR": 1,
                        "I:1299747019#L:PEDROZA SR#D:04/19/1964#R:O": 1,
                        "L:PEDROZA SR#D:04/19/1964#S:M": 1,
                        "F:ERNESTO#S:M": 2,
                        "I:6456839076#F:ERNESTO#S:M": 1,
                        "I:1299747019#F:ERNESTO#D:04/19/1964": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#S:M#R:O": 1,
                        "I:1777743279#L:BROST#D:05/04/1994#S:M": 1,
                        "F:ALEXANDER": 1,
                        "I:1742682819#F:SARA#L:BOONE#S:F": 1,
                        "F:OMONDI#D:09/29/1978#R:W": 1,
                        "I:5678412359#L:SWANSON#D:05/16/1961#S:M": 1,
                        "F:OMONDI#D:09/29/1978": 1,
                        "I:4897541253#L:SWANSON": 1,
                        "F:EMMA#L:BRIGGS#S:F#R:W": 1,
                        "I:4897541253#D:05/16/1916": 1,
                        "I:1777743278#L:BROST#D:05/04/1994#R:W": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST#D:05/04/1994#S:M#R:W": 1,
                        "I:1742682819#L:BOONE#R:W": 1,
                        "I:1777743278#F:ALEXANDRA#D:05/04/1994#R:W": 1,
                        "I:1856554310#L:OMONDI#D:09/29/1978#S:F": 1,
                        "D:05/16/1961": 1,
                        "F:ERNESTO#L:PEDROZA JR": 1,
                        "F:SARA#R:W": 2,
                        "I:4897541253#D:05/16/1916#S:M": 1,
                        "I:6456839076": 1,
                        "F:ALEXANDRA#L:BROST#S:F#R:W": 1,
                        "F:SARA#L:STYLES-BOONE": 1,
                        "I:4897541253#L:SWANSON#R:B": 1,
                        "I:1742682819#F:SARA#R:W": 1,
                        "F:GAILYA#S:F#R:W": 1,
                        "D:05/16/1961#R:B": 1,
                        "I:1742682819#F:SARA#L:BOONE#D:05/21/1988#S:F": 1,
                        "I:1856554310#D:09/29/1978#S:F#R:W": 1,
                        "F:ERNESTO": 2,
                        "I:1777743279#F:ALEXANDER#D:05/04/1994#S:M": 1,
                        "L:STYLES-BOONE#D:05/21/1988": 1,
                        "F:ALEXANDER#L:BROST#D:05/04/1994": 1,
                        "I:9320952205#L:DEYTON#R:W": 1,
                        "I:1777743279#F:ALEXANDER#D:05/04/1994": 1,
                        "I:1742682819#F:SARA#D:05/21/1988#R:W": 1,
                        "I:1299747019#L:PEDROZA SR#D:04/19/1964": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#S:M": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1961#S:M#R:B": 1,
                        "F:ERNESTO#D:04/19/1964#S:M": 1,
                        "L:BROST#D:05/04/1994#S:F": 1,
                        "F:SARA#L:STYLES-BOONE#D:05/21/1988#S:F": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#D:12/29/1987#S:F": 1,
                        "F:ERNESTO#L:PEDROZA SR#D:04/19/1964": 1,
                        "I:6456839076#L:PEDROZA JR#D:07/23/1997": 1,
                        "I:1856554310#S:F#R:W": 1,
                        "I:4897541253#F:RUFORD#S:M#R:B": 1,
                        "I:1299747019#F:ERNESTO#D:04/19/1964#S:M": 1,
                        "I:1742682819#L:BOONE#D:05/21/1988#S:F#R:W": 1,
                        "I:1742668281#F:SARA#S:F#R:W": 1,
                        "I:1742668281#S:F#R:W": 1,
                        "I:1742682819#F:SARA#D:05/21/1988#S:F#R:W": 1,
                        "L:BOONE#D:05/21/1988": 1,
                        "F:ALEXANDER#D:05/04/1994#S:M": 1,
                        "I:1777743279#F:ALEXANDER#S:M": 1,
                        "I:5678412359#L:SWANSON#R:B": 1,
                        "F:SARA#L:STYLES-BOONE#D:05/21/1988#S:F#R:W": 1,
                        "F:SARA#L:BOONE#S:F": 1,
                        "F:RUFORD#L:SWANSON#S:M": 2,
                        "I:1856554310#F:GAILYA#S:F#R:W": 1,
                        "I:5678412359#L:SWANSON#D:05/16/1961#S:M#R:B": 1,
                        "I:6456839076#D:07/23/1997#S:M#R:O": 1,
                        "L:SWANSON#R:B": 2,
                        "D:12/29/1987#S:F": 2,
                        "I:1777743278#S:F#R:W": 1,
                        "F:GAILYA#L:OMONDI#D:09/29/1978#R:W": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#D:07/23/1997": 1,
                        "I:4897541253#F:RUFORD#D:05/16/1916#S:M": 1,
                        "L:OMONDI#D:09/29/1978#S:F#R:W": 1,
                        "F:OMONDI#L:GAILYA#D:09/29/1978": 1,
                        "I:#F:OMONDI#L:GAILYA#D:09/29/1978": 1,
                        "I:1742668281#F:SARA#D:05/21/1988#S:F#R:W": 1,
                        "F:EMMA#L:BRIGGS#D:12/29/1987#R:W": 1,
                        "I:1299747019": 1,
                        "D:05/16/1916#S:M#R:B": 1,
                        "F:ALEXANDER#L:BROST#S:M#R:W": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST#R:W": 1,
                        "I:4897541253": 1,
                        "D:05/04/1994#S:M": 1,
                        "F:ALEXANDER#L:BROST#S:M": 1,
                        "I:1742668281#L:STYLES-BOONE#S:F": 1,
                        "D:05/04/1994#S:F": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#D:05/21/1988#R:W": 1,
                        "I:5678412359#F:RUFORD#S:M": 1,
                        "I:1742668281#D:05/21/1988#R:W": 1,
                        "F:OMONDI#D:09/29/1978#S:F": 1,
                        "L:#F:OMONDI#D:09/29/1978#S:F": 1,
                        "I:9320952205#L:DEYTON#S:F#R:W": 1,
                        "F:SARA#S:F#R:W": 2,
                        "F:RUFORD#D:05/16/1961#S:M": 1,
                        "I:9320952205#F:EMMA#D:12/29/1987#S:F#R:W": 2,
                        "I:9320952205#F:EMMA": 2,
                        "F:ALEXANDRA#L:BROST#D:05/04/1994#S:F#R:W": 1,
                        "F:ALEXANDRA#L:BROST#D:05/04/1994#S:F": 1,
                        "L:SWANSON#S:M": 2,
                        "I:1777743279#L:BROST#S:M#R:W": 1,
                        "L:BOONE#S:F": 1,
                        "L:STYLES-BOONE#R:W": 1,
                        "F:ERNESTO#L:PEDROZA SR#S:M#R:O": 1,
                        "I:9320952205#L:BRIGGS#D:12/29/1987#R:W": 1,
                        "I:1299747019#L:PEDROZA SR": 1,
                        "I:5678412359#S:M": 1,
                        "F:ERNESTO#L:PEDROZA JR#D:07/23/1997": 1,
                        "L:PEDROZA SR#S:M#R:O": 1,
                        "I:1856554310#F:GAILYA#D:09/29/1978#R:W": 1,
                        "D:05/04/1994#S:M#R:W": 1,
                        "D:05/21/1988#R:W": 2,
                        "I:1742682819#L:BOONE#D:05/21/1988#S:F": 1,
                        "I:1742682819#L:BOONE": 1,
                        "F:ERNESTO#L:PEDROZA JR#D:07/23/1997#S:M#R:O": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#S:F": 1,
                        "F:EMMA#L:DEYTON": 1,
                        "L:BRIGGS#D:12/29/1987#R:W": 1,
                        "L:DEYTON#R:W": 1,
                        "I:4897541253#F:RUFORD": 1,
                        "F:ALEXANDRA#L:BROST#D:05/04/1994": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#S:F#R:W": 1,
                        "F:ALEXANDRA#D:05/04/1994": 1,
                        "L:OMONDI#R:W": 1,
                        "I:1299747019#L:PEDROZA SR#R:O": 1,
                        "L:BROST#D:05/04/1994#S:M#R:W": 1,
                        "I:1856554310#F:GAILYA#R:W": 1,
                        "F:ALEXANDRA#D:05/04/1994#R:W": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#S:M#R:O": 1,
                        "I:1777743279#L:BROST#R:W": 1,
                        "I:1299747019#F:ERNESTO#R:O": 1,
                        "I:1777743279#S:M": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#D:12/29/1987#S:F#R:W": 1,
                        "F:SARA#L:BOONE#D:05/21/1988": 1,
                        "I:1856554310#L:OMONDI#S:F#R:W": 1,
                        "L:STYLES-BOONE#D:05/21/1988#S:F": 1,
                        "F:RUFORD#D:05/16/1961#S:M#R:B": 1,
                        "L:BOONE#D:05/21/1988#S:F": 1,
                        "L:OMONDI": 1,
                        "L:GAILYA#R:W": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1961#R:B": 1,
                        "I:9320952205#F:EMMA#L:DEYTON": 1,
                        "F:RUFORD#D:05/16/1916#R:B": 1,
                        "F:OMONDI#L:GAILYA#R:W": 1,
                        "D:05/21/1988#S:F#R:W": 2,
                        "I:1777743279#D:05/04/1994#S:M#R:W": 1,
                        "F:ALEXANDRA": 1,
                        "I:1777743279#F:ALEXANDER#D:05/04/1994#R:W": 1,
                        "I:1856554310#D:09/29/1978#R:W": 1,
                        "I:1742682819#F:SARA#D:05/21/1988#S:F": 1,
                        "F:ERNESTO#D:07/23/1997#R:O": 1,
                        "I:6456839076#R:O": 1,
                        "D:05/16/1961#S:M#R:B": 1,
                        "D:09/29/1978": 2,
                        "I:1777743278#R:W": 1,
                        "F:SARA#L:BOONE": 1,
                        "D:07/23/1997#R:O": 1,
                        "D:09/29/1978#S:F#R:W": 2,
                        "F:RUFORD#D:05/16/1916": 1,
                        "I:9320952205#D:12/29/1987#R:W": 2,
                        "I:1742668281#F:SARA#D:05/21/1988#S:F": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#R:O": 1,
                        "L:BOONE": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#D:05/04/1994#S:F#R:W": 1,
                        "L:PEDROZA JR#S:M": 1,
                        "I:1742682819#D:05/21/1988#R:W": 1,
                        "I:1299747019#L:PEDROZA SR#S:M#R:O": 1,
                        "I:9320952205#L:BRIGGS#S:F": 1,
                        "D:12/29/1987#S:F#R:W": 2,
                        "L:PEDROZA SR#D:04/19/1964": 1,
                        "I:1856554310#L:OMONDI": 1,
                        "I:1777743278#D:05/04/1994#S:F": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#D:05/16/1916#R:B": 1,
                        "D:05/04/1994#S:F#R:W": 1,
                        "D:04/19/1964#S:M#R:O": 1,
                        "I:1777743278#F:ALEXANDRA": 1,
                        "L:SWANSON#D:05/16/1916#S:M": 1,
                        "I:1777743278#L:BROST": 1,
                        "I:6456839076#D:07/23/1997#S:M": 1,
                        "I:1742668281#F:SARA": 1,
                        "I:1856554310#F:GAILYA#S:F": 1,
                        "F:EMMA#L:DEYTON#D:12/29/1987#S:F#R:W": 1,
                        "I:1742682819#S:F": 1,
                        "I:1777743279#F:ALEXANDER": 1,
                        "L:OMONDI#D:09/29/1978#R:W": 1,
                        "I:#L:OMONDI#D:09/29/1978#R:W": 1,
                        "F:SARA#D:05/21/1988": 2,
                        "I:1777743278#F:ALEXANDRA#L:BROST#D:05/04/1994#S:F": 1,
                        "L:SWANSON#D:05/16/1916": 1,
                        "I:1742682819#F:SARA#D:05/21/1988": 1,
                        "I:5678412359#F:RUFORD#S:M#R:B": 1,
                        "I:1856554310#S:F": 1,
                        "L:DEYTON": 1,
                        "F:EMMA#D:12/29/1987#S:F": 2,
                        "F:ERNESTO#L:PEDROZA SR#S:M": 1,
                        "I:1742682819#S:F#R:W": 1,
                        "I:1742668281#L:STYLES-BOONE#D:05/21/1988": 1,
                        "L:BRIGGS#D:12/29/1987#S:F#R:W": 1,
                        "F:OMONDI#L:GAILYA#D:09/29/1978#S:F#R:W": 1,
                        "I:#F:OMONDI#L:GAILYA#D:09/29/1978#S:F#R:W": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1961": 1,
                        "I:5678412359": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#D:05/04/1994": 1,
                        "I:1742668281#F:SARA#R:W": 1,
                        "F:GAILYA#L:OMONDI": 1,
                        "F:EMMA#L:DEYTON#D:12/29/1987#S:F": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#S:M": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#D:09/29/1978#S:F#R:W": 1,
                        "L:PEDROZA SR#R:O": 1,
                        "I:1777743278": 1,
                        "I:1777743279": 1,
                        "L:GAILYA#S:F#R:W": 1,
                        "I:6456839076#D:07/23/1997": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#D:05/16/1961": 1,
                        "I:9320952205#R:W": 2,
                        "L:GAILYA": 1,
                        "I:5678412359#F:RUFORD#D:05/16/1961#R:B": 1,
                        "F:ALEXANDER#L:BROST#D:05/04/1994#R:W": 1,
                        "I:1777743278#L:BROST#R:W": 1,
                        "F:SARA#L:BOONE#S:F#R:W": 1,
                        "L:BRIGGS#S:F#R:W": 1,
                        "I:9320952205#F:EMMA#S:F": 2,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#S:F": 1,
                        "F:OMONDI#R:W": 1,
                        "F:GAILYA#L:OMONDI#D:09/29/1978#S:F": 1,
                        "I:6456839076#F:ERNESTO#D:07/23/1997#S:M#R:O": 1,
                        "L:BOONE#R:W": 1,
                        "F:SARA#L:BOONE#D:05/21/1988#S:F": 1,
                        "I:4897541253#F:RUFORD#S:M": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#S:F#R:W": 1,
                        "I:1742668281#L:STYLES-BOONE#D:05/21/1988#S:F#R:W": 1,
                        "F:ERNESTO#L:PEDROZA JR#S:M": 1,
                        "D:04/19/1964": 1,
                        "F:RUFORD#L:SWANSON#D:05/16/1916#S:M": 1,
                        "I:6456839076#L:PEDROZA JR#D:07/23/1997#R:O": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON": 1,
                        "S:F#R:W": 7,
                        "I:9320952205#S:F#R:W": 2,
                        "I:5678412359#F:RUFORD#D:05/16/1961": 1,
                        "I:6456839076#F:ERNESTO": 1,
                        "F:SARA": 2,
                        "I:1742682819#F:SARA#L:BOONE#D:05/21/1988#R:W": 1,
                        "I:6456839076#L:PEDROZA JR#S:M#R:O": 1,
                        "I:5678412359#D:05/16/1961#S:M": 1,
                        "D:07/23/1997#S:M#R:O": 1,
                        "I:1742668281#F:SARA#D:05/21/1988": 1,
                        "I:1856554310#F:GAILYA#D:09/29/1978#S:F#R:W": 1,
                        "L:BRIGGS": 1,
                        "D:07/23/1997": 1,
                        "F:EMMA#S:F#R:W": 2,
                        "L:DEYTON#D:12/29/1987#S:F": 1,
                        "I:6456839076#F:ERNESTO#D:07/23/1997": 1,
                        "I:6456839076#F:ERNESTO#D:07/23/1997#S:M": 1,
                        "I:9320952205#L:DEYTON#D:12/29/1987#R:W": 1,
                        "I:9320952205#F:EMMA#S:F#R:W": 2,
                        "I:1299747019#R:O": 1,
                        "I:1777743278#F:ALEXANDRA#D:05/04/1994#S:F": 1,
                        "I:1299747019#L:PEDROZA SR#D:04/19/1964#S:M": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE": 1,
                        "I:1856554310#D:09/29/1978": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#S:F": 1,
                        "I:1777743279#R:W": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#R:B": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST#D:05/04/1994#S:M": 1,
                        "I:1742668281#L:STYLES-BOONE#D:05/21/1988#S:F": 1,
                        "I:1742682819#F:SARA#L:BOONE#D:05/21/1988#S:F#R:W": 1,
                        "I:1777743278#D:05/04/1994#S:F#R:W": 1,
                        "I:9320952205#F:EMMA#D:12/29/1987": 2,
                        "F:SARA#L:STYLES-BOONE#R:W": 1,
                        "F:RUFORD#S:M#R:B": 2,
                        "I:1777743278#F:ALEXANDRA#R:W": 1,
                        "F:RUFORD": 2,
                        "L:PEDROZA SR#D:04/19/1964#R:O": 1,
                        "F:EMMA#L:BRIGGS#R:W": 1,
                        "L:PEDROZA JR#D:07/23/1997#R:O": 1,
                        "I:1856554310#F:GAILYA#D:09/29/1978": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#D:05/16/1916": 1,
                        "I:4897541253#F:RUFORD#D:05/16/1916#R:B": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST#R:W": 1,
                        "I:5678412359#D:05/16/1961#R:B": 1,
                        "I:4897541253#L:SWANSON#D:05/16/1916#S:M#R:B": 1,
                        "I:1856554310#R:W": 1,
                        "I:1777743279#L:BROST#D:05/04/1994#R:W": 1,
                        "I:1777743278#S:F": 1,
                        "I:1742682819#F:SARA#L:BOONE#R:W": 1,
                        "I:1742668281#F:SARA#D:05/21/1988#R:W": 1,
                        "F:RUFORD#D:05/16/1961#R:B": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR": 1,
                        "D:05/04/1994#R:W": 2,
                        "L:PEDROZA JR#D:07/23/1997": 1,
                        "F:ERNESTO#D:04/19/1964#S:M#R:O": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI#D:09/29/1978#S:F": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#R:W": 1,
                        "L:SWANSON#D:05/16/1916#R:B": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#D:12/29/1987#S:F": 1,
                        "I:1777743278#L:BROST#D:05/04/1994": 1,
                        "I:4897541253#L:SWANSON#S:M": 1,
                        "L:PEDROZA JR#R:O": 1,
                        "I:1742668281#D:05/21/1988": 1,
                        "F:ERNESTO#R:O": 2,
                        "I:4897541253#D:05/16/1916#R:B": 1,
                        "I:6456839076#L:PEDROZA JR#S:M": 1,
                        "F:EMMA#S:F": 2,
                        "F:EMMA#L:DEYTON#R:W": 1,
                        "F:OMONDI#L:GAILYA#D:09/29/1978#S:F": 1,
                        "I:F:OMONDI#L:GAILYA#D:09/29/1978#S:F": 1,
                        "I:1742668281#F:SARA#L:STYLES-BOONE#S:F#R:W": 1,
                        "F:GAILYA#L:OMONDI#S:F": 1,
                        "F:OMONDI#S:F#R:W": 1,
                        "I:#F:OMONDI#S:F#R:W": 1,
                        "I:#F:OMONDI#L:GAILYA#D:09/29/1978#S:F":1,
                        "I:#F:OMONDI#L:GAILYA#D:09/29/1978":1,
                        "I:#F:OMONDI#L:GAILYA":1,
                        "I:1777743278#F:ALEXANDRA#S:F#R:W": 1,
                        "F:ALEXANDER#D:05/04/1994#S:M#R:W": 1,
                        "I:1299747019#D:04/19/1964": 1,
                        "F:RUFORD#S:M": 2,
                        "F:OMONDI": 1,
                        "I:#F:OMONDI": 1,
                        "D:04/19/1964#R:O": 1,
                        "I:1856554310#F:GAILYA#L:OMONDI": 1,
                        "I:1777743278#L:BROST#D:05/04/1994#S:F#R:W": 1,
                        "I:9320952205#L:DEYTON": 1,
                        "I:5678412359#S:M#R:B": 1,
                        "I:5678412359#F:RUFORD#D:05/16/1961#S:M#R:B": 1,
                        "F:SARA#L:STYLES-BOONE#D:05/21/1988#R:W": 1,
                        "F:EMMA#D:12/29/1987#S:F#R:W": 2,
                        "I:1856554310": 1,
                        "F:ALEXANDRA#L:BROST#S:F": 1,
                        "L:BROST#D:05/04/1994#R:W": 2,
                        "F:ERNESTO#D:04/19/1964#R:O": 1,
                        "L:PEDROZA JR#D:07/23/1997#S:M#R:O": 1,
                        "D:09/29/1978#S:F": 2,
                        "F:GAILYA#D:09/29/1978#S:F#R:W": 1,
                        "I:9320952205#F:EMMA#L:BRIGGS#D:12/29/1987#S:F#R:W": 1,
                        "I:9320952205#F:EMMA#D:12/29/1987#S:F": 2,
                        "F:GAILYA#D:09/29/1978": 1,
                        "I:6456839076#F:ERNESTO#L:PEDROZA JR#R:O": 1,
                        "I:1777743279#F:ALEXANDER#L:BROST#S:M#R:W": 1,
                        "I:9320952205#S:F": 2,
                        "I:5678412359#D:05/16/1961#S:M#R:B": 1,
                        "I:1856554310#L:OMONDI#S:F": 1,
                        "I:6456839076#S:M#R:O": 1,
                        "F:GAILYA#S:F": 1,
                        "F:GAILYA#L:OMONDI#D:09/29/1978#S:F#R:W": 1,
                        "I:1299747019#F:ERNESTO#L:PEDROZA SR#D:04/19/1964#R:O": 1,
                        "F:ERNESTO#L:PEDROZA JR#S:M#R:O": 1,
                        "F:SARA#L:BOONE#R:W": 1,
                        "F:GAILYA": 1,
                        "I:4897541253#S:M": 1,
                        "I:1777743278#F:ALEXANDRA#L:BROST": 1,
                        "F:EMMA#D:12/29/1987": 2,
                        "L:BRIGGS#D:12/29/1987": 1,
                        "I:6456839076#S:M": 1,
                        "L:DEYTON#D:12/29/1987#S:F#R:W": 1,
                        "I:4897541253#L:SWANSON#D:05/16/1916#S:M": 1,
                        "I:5678412359#F:RUFORD": 1,
                        "F:RUFORD#D:05/16/1916#S:M#R:B": 1,
                        "I:1742682819#D:05/21/1988": 1,
                        "I:1777743279#F:ALEXANDER#R:W": 1,
                        "I:9320952205#F:EMMA#L:DEYTON#D:12/29/1987": 1,
                        "I:9320952205#L:BRIGGS#D:12/29/1987": 1,
                        "I:5678412359#F:RUFORD#L:SWANSON#D:05/16/1961#R:B": 1,
                        "I:1299747019#D:04/19/1964#S:M": 1,
                        "I:6456839076#L:PEDROZA JR#D:07/23/1997#S:M#R:O": 1,
                        "I:9320952205#L:DEYTON#D:12/29/1987": 1,
                        "L:BOONE#D:05/21/1988#S:F#R:W": 1,
                        "I:1299747019#L:PEDROZA SR#S:M": 1,
                        "I:4897541253#F:RUFORD#L:SWANSON#D:05/16/1916#S:M#R:B": 1,
                        "F:ALEXANDRA#S:F": 1,
                        "I:1777743278#F:ALEXANDRA#D:05/04/1994": 1,
                        "I:9320952205#L:BRIGGS#S:F#R:W": 1,
                        "I:1777743279#D:05/04/1994": 1,
                        "F:ERNESTO#L:PEDROZA SR#D:04/19/1964#S:M": 1,
                        "I:6456839076#F:ERNESTO#R:O": 1,
                        "F:RUFORD#D:05/16/1961": 1,
                        "F:ERNESTO#L:PEDROZA JR#D:07/23/1997#S:M": 1,
                        //new row
                        "I:1000172572":1,
                        "I:1000173572":1,
                        "I:1000172572#F:FURNESS":1,
                        "I:1000172572#F:FURNESS#R:B":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#R:B":1,
                        "I:1000172572#L:ARMSTEAD":1,
                        "I:1000172572#L:ARMSTEAD#R:B":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#D:09/25/1922":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#R:B":1,
                        "I:1000172572#L:ARMSTEAD#D:09/25/1922":1,
                        "I:1000172572#L:ARMSTEAD#D:09/25/1922#R:B":1,
                        "I:1000172572#F:FURNESS#D:09/25/1922":1,
                        "I:1000172572#F:FURNESS#D:09/25/1922#R:B":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M":1,
                        "I:1000172572#L:ARMSTEAD#D:09/25/1922#S:M":1,
                        "I:1000172572#L:ARMSTEAD#D:09/25/1922#S:M#R:B":1,
                        "I:1000172572#F:FURNESS#D:09/25/1922#S:M":1,
                        "I:1000172572#F:FURNESS#D:09/25/1922#S:M#R:B":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#S:M":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#S:M#R:B":1,
                        "I:1000172572#D:09/25/1922#S:M":1,
                        "I:1000172572#D:09/25/1922#S:M#R:B":1,
                        "I:1000172572#F:FURNESS#S:M":1,
                        "I:1000172572#F:FURNESS#S:M#R:B":1,
                        "I:1000172572#L:ARMSTEAD#S:M":1,
                        "I:1000172572#L:ARMSTEAD#S:M#R:B":1,
                        "I:1000172572#S:M":1,
                        "I:1000172572#S:M#R:B":1,
                        "I:1000172572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M#R:B":1,

                        "I:1000173572#F:FURNESS":1,
                        "I:1000173572#F:FURNESS#R:B":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#R:B":1,
                        "I:1000173572#L:ARMSTEAD":1,
                        "I:1000173572#L:ARMSTEAD#R:B":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#D:09/25/1922":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#R:B":1,
                        "I:1000173572#L:ARMSTEAD#D:09/25/1922":1,
                        "I:1000173572#L:ARMSTEAD#D:09/25/1922#R:B":1,
                        "I:1000173572#F:FURNESS#D:09/25/1922":1,
                        "I:1000173572#F:FURNESS#D:09/25/1922#R:B":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M":1,
                        "I:1000173572#L:ARMSTEAD#D:09/25/1922#S:M":1,
                        "I:1000173572#L:ARMSTEAD#D:09/25/1922#S:M#R:B":1,
                        "I:1000173572#F:FURNESS#D:09/25/1922#S:M":1,
                        "I:1000173572#F:FURNESS#D:09/25/1922#S:M#R:B":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#S:M":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#S:M#R:B":1,
                        "I:1000173572#D:09/25/1922#S:M":1,
                        "I:1000173572#D:09/25/1922#S:M#R:B":1,
                        "I:1000173572#F:FURNESS#S:M":1,
                        "I:1000173572#F:FURNESS#S:M#R:B":1,
                        "I:1000173572#L:ARMSTEAD#S:M":1,
                        "I:1000173572#L:ARMSTEAD#S:M#R:B":1,
                        "I:1000173572#S:M":1,
                        "I:1000173572#S:M#R:B":1,
                        "I:1000173572#F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M#R:B":1,


                        "F:FURNESS":2,
                        "F:FURNESS#L:ARMSTEAD":2,
                        "F:FURNESS#L:ARMSTEAD#D:09/25/1922":2,
                        "F:FURNESS#D:09/25/1922":2,
                        "F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M":2,
                        "F:FURNESS#S:M":2,
                        "F:FURNESS#L:ARMSTEAD#S:M":2,
                        "F:FURNESS#D:09/25/1922#S:M":2,
                        "F:FURNESS#L:ARMSTEAD#D:09/25/1922#S:M#R:B":2,
                        "F:FURNESS#D:09/25/1922#S:M#R:B":2,
                        "F:FURNESS#D:09/25/1922#R:B":2,
                        "F:FURNESS#S:M#R:B":2,
                        "F:FURNESS#R:B":2,


                        "L:ARMSTEAD":2,
                        "L:ARMSTEAD#D:09/25/1922":2,
                        "L:ARMSTEAD#D:09/25/1922#S:M":2,
                        "L:ARMSTEAD#S:M":2,
                        "L:ARMSTEAD#D:09/25/1922#S:M#R:B":2,
                        "L:ARMSTEAD#S:M#R:B":2,
                        "L:ARMSTEAD#D:09/25/1922#R:B":2,
                        "L:ARMSTEAD#R:B":2,

                        "D:09/25/1922":2,
                        "D:09/25/1922#S:M":2,
                        "D:09/25/1922#S:M#R:B":2,
                        "D:09/25/1922#R:B":2


                    };
                    var array_elements = ["#c11", "#c21", "#c13","#c23", "#c14","#c24","#c16", "#c26","#c17","#c27","#c18","#c28"];
                    key_value = "";
                    key_value_prev = "";
                    key_value_sib = "";
                    key_value_sib_prev = "";
                    //console.log(original_text);
                    //console.log(original_text_sibling);
                    //console.log(j);
                    //console.log(original_text != "","true?");
                    if(array_elements.indexOf(j)>0){//&&original_text != ""
                        array_elements = array_elements.splice(array_elements.indexOf(j));//skipping the missing value
                    }
                    var isClicked = false;
                    var current_id = d3.select(this).attr("id");
                    var current_cell = d3.select(this).text();// prev_text_sibling is actually current_cell's sibling
                    if( current_cell.indexOf('*') != -1 ){
                        current_cell = current_cell.split("*").join("");
                        if(current_cell.indexOf('&') != -1||current_cell.indexOf('@') != -1 ||prev_text_sibling.indexOf('&') != -1||current_cell.indexOf('@') != -1 ){
                    isClicked = true;}
                    else{isClicked = false;}
                    }
                    var current_id_number=current_id.replace("c", " ");
                    //console.log("current id number is",current_id_number);
                    var onclick_id = "#c"+question_number.toString().trim();
                    for(var i = 0; i < array_elements.length; i++){

                        var displayedText = x.select(array_elements[i]).text();
                        var isEmpty = false;
                        if(x.select(array_elements[i]).text()==""){
                            isEmpty = true;
                        }
                        displayedText = displayedText.split("&").join("");
                        displayedText = displayedText.split("/").join("");
                        displayedText = displayedText.split("@").join("");
                        displayedText = displayedText.split("*").join("");
                        displayedText = displayedText.split(" ").join("");
                        displayedText = displayedText.trim();
                        if(displayedText != ""||array_elements[i]==onclick_id||isEmpty){//here
                            isEmpty = false;
                        //console.log(array_elements[i]);
                        cell_question_number = array_elements[i];//#c11
                        question_number=cell_question_number.replace("c", "");
                        question_number=question_number.replace("#", "");//11
                        cell_pair_number = d3.select(this.parentNode).attr("id");//g11
                        pair_number = cell_pair_number.replace("g", " ")//11
                        //label #D,#I,#F
                            var missingValue = "";
                            var skipMissingValue = false;
                            var skipMissingValue_sib = false;
                            // if(parseInt(question_number)<20){
                            //     original_text = experimentr.data()["section2"][0][pair_num ][0][question_number-10];
                            // }
                            // else if(parseInt(question_number)>20){
                            //     original_text = experimentr.data()["section2"][0][pair_num ][1][question_number-20];
                            // }
                            // if(original_text == missingValue){
                            //     skipMissingValue = true;
                            // }
                            // if(original_text_sibling == missingValue){
                            //     skipMissingValue_sib = true;
                            // }
                            //console.log(skipMissingValue,":skipMissingval");
                            //console.log(skipMissingValue_sib,":skipMissingval_sib");
                            current_cell = d3.select(this).text();

                        switch(parseInt(question_number)) {
                            case 11:
                            case 21:
                                    original_text = "#I:";
                                    break;
                            case 13:
                            case 23:
                                    original_text = "#F:";
                                    break;
                            case 14:
                            case 24:
                                    original_text = "#L:";
                                    break;
                            case 16:
                            case 26:
                                    original_text = "#D:";
                                    break;
                            case 17:
                            case 27:
                                    original_text = "#S:";
                                    break;
                            case 18:
                            case 28:
                                    original_text = "#R:";
                                    break;
                                default:
                                    break;
                            }
                            //console.log(prev_text_sibling);
                            // if(current_cell != "" && prev_text_sibling !=""){
                            // original_text_sibling = original_text;}
                            // else if(current_cell != "" && prev_text_sibling ==""){
                            //     original_text_sibling ="";
                            // }
                            // else if(current_cell == "" && prev_text_sibling !=""){
                            //     original_text = "";
                            // }
                            // else{
                            //     original_text = "";
                            //     original_text_sibling = original_text;
                            // }

                            if( skipMissingValue == false){
                            original_text_sibling = original_text;}
                            else{
                                original_text = "";
                                skipMissingValue = false;
                            }

                            if( skipMissingValue_sib == false){
                                original_text_sibling = original_text;}
                            else{
                                original_text_sibling = "";
                                skipMissingValue_sib = false;
                            }
                            //console.log("parseInt(question_number)",parseInt(question_number));

                            var current_id_num = parseInt(current_id_number);
                            //console.log("current_id_number",current_id_num);
                            if(parseInt(question_number)<20 && current_id_num <20){
                               // console.log(parseInt(question_number));
                                var pageNumber =  experimentr.data()["current_question_page"] -1;
                                original_text = original_text + experimentr.data()["section2"][pageNumber][pair_num%6 ][0][question_number-10];
                        original_text_sibling = original_text_sibling + experimentr.data()["section2"][pageNumber][pair_num %6][1][question_number-10];
                        }
                        else if(parseInt(question_number)>20&& current_id_num >20){
                               //console.log(parseInt(question_number));
                            original_text = original_text + experimentr.data()["section2"][pageNumber][pair_num%6][1][question_number-20];
                            original_text_sibling = original_text_sibling + experimentr.data()["section2"][pageNumber][pair_num%6][0][question_number-20];
                            }
                        else{
                            original_text="";
                            original_text_sibling="";
                            }
                        console.log("original_text_sibling is",original_text_sibling);
                            //handle missing value
                            current_cell = d3.select(this).text();
                            prev_text_sibling = d3.select(this.parentNode).select("#"+sibling_id).text();
                            //console.log(current_cell);
                            //console.log(prev_text_sibling);
                            current_cell = current_cell.split('/').join("");

                            if(current_cell != "" && current_cell.split('*').join("") == "" && prev_text_sibling == ""){//click on **, sibling missing
                                key_value = key_value + original_text;
                                key_value_sib = key_value_sib + "";
                            }
                            else if(current_cell == "" && prev_text_sibling.split('*').join("") == "" && prev_text_sibling != ""){
                                original_text = "";
                                key_value = key_value + "";
                                key_value_sib = key_value_sib + original_text_sibling;
                            }
                            else if(current_cell == "" && prev_text_sibling.split('*').join("") != "" ){
                                original_text ="";
                                original_text_sibling ="";
                                key_value = key_value + "";
                                key_value_sib = key_value_sib + "";
                            }
                            else{
                        key_value = key_value + original_text;
                        key_value_sib = key_value_sib + original_text_sibling;}
                        //console.log("current key_value is,", key_value);
                        //console.log("current key_value_sib is,", key_value_sib);
                            if(array_elements[i]!=onclick_id){//do not count the current cell

                                    key_value_prev = key_value_prev + original_text;
                                    key_value_sib_prev = key_value_sib_prev + original_text_sibling;}


                        }

                    }
                    console.log(isClicked,":is clicked");
                    if(isClicked == false){
                    key_value =key_value.substring(1);
                    key_value_prev =key_value_prev.substring(1);
                    key_value_sib =key_value_sib.substring(1);
                    key_value_sib_prev =key_value_sib_prev.substring(1);
                    console.log("key_value prev is",key_value_prev);
                    console.log("key value is:",key_value);
                    console.log("key value sib is:",key_value_sib);
                    console.log("key value sib prev is:",key_value_sib_prev);
                    console.log("key value is:",json_content[key_value]);
                    console.log("key_value_sib is:",json_content[key_value_sib]);
                    if(typeof json_content[key_value_prev] == 'undefined'){//nothing has been opened in this row
                        json_content[key_value_prev] = 5;
                    }
                    if(typeof json_content[key_value_sib_prev] == 'undefined'){//nothing has been opened in this row
                            json_content[key_value_sib_prev] = 5;
                    }
                    // if(typeof json_content[key_value_sib] == 'undefined'){//there is a missing value, use a big num so deltaK<0
                    //         json_content[key_value_sib] = 1000;
                    // }
                    // if(typeof json_content[key_value] == 'undefined'){//there is a missing value,, use a big num so deltaK<0
                    //         json_content[key_value] = 1000;
                    // }
                    console.log("key value prev is:",json_content[key_value_prev]);
                    console.log("key_value_sib prev is:",json_content[key_value_sib_prev]);
                     //console.log("key value prev is:",json_content[key_value_prev]);
                    var deltaK  = json_content[key_value_prev]-json_content[key_value];
                    var deltaK_sib = json_content[key_value_sib_prev]-json_content[key_value_sib];
                    console.log("deltaK is:",deltaK);
                    console.log("deltaK_sib is:",deltaK_sib);

                     if(deltaK<0){
                        privacy_score_decrement = 0;
                    }
                    else{
                        privacy_score_decrement  = 100 * deltaK /12/4;}
                    if(deltaK_sib <0){
                        privacy_score_decrement_sib = 0;
                    }
                    else{
                        privacy_score_decrement_sib  = 100 * deltaK_sib /12/4;}

                        if(json_content[key_value_prev] >=5){
                        if(json_content[key_value] >= 5){
                            privacy_score_decrement = 0;
                        }
                        else{
                            privacy_score_decrement  = 100 * (5-json_content[key_value]) /12/4;
                        }
                        }
                        if(json_content[key_value_sib_prev] >=5){
                            if(json_content[key_value_sib] >= 5){
                                privacy_score_decrement_sib = 0;
                            }
                            else{
                                privacy_score_decrement_sib  = 100 * (5-json_content[key_value_sib]) /12/4;
                            }
                        }}
                    else{
                        privacy_score_decrement  = 0;
                        privacy_score_decrement_sib  = 0;
                    }


                    if(json_content[key_value]<5){
                    current_privacy = current_privacy - privacy_score_decrement;
                    changePrivacy(current_privacy,privacy_score_decrement);}
                    if(json_content[key_value_sib]<5){
                    current_privacy = current_privacy - privacy_score_decrement_sib;
                    changePrivacy(current_privacy,privacy_score_decrement_sib);}
                    console.log("end");
                    // prev_text = prev_text.split("&").join("");
                    // prev_text = prev_text.split("/").join("");
                    // prev_text = prev_text.split("@").join("");



                    if ((["First name", "Last name"].indexOf(title[j % cwidth.length]) >= 0) && d3.select(this.parentNode).select("#c13").attr("swap_detect")) {
                        // console.log(typeof(d3.select(this.parentNode).select("#c13").select("#swap")));
                        var x = d3.select(this.parentNode);
                        x.select("#c13").remove();
                        x.select("#c23").remove();
                        x.select("#c14").remove();
                        x.select("#c24").remove();
                        row_num = 1;
                        if (j % 10 == 4) {
                            j = j - 1;
                        }


                        var next_text_1 = dat[g.attr("id").slice(1) % 6][1][mapping[j % cwidth.length]];
                        var next_text_2 = dat[g.attr("id").slice(1) % 6][0][mapping[j % cwidth.length]];

                        //console.log("j is", j);
                        //console.log("cwidth.length is", cwidth.length);
                        // var next_text_3 = dat[g.attr("id").slice(1) % 6][Math.abs(row_num)][mapping[j % cwidth.length]];
                        // var next_text_4 = dat[g.attr("id").slice(1) % 6][Math.abs(row_num - 1)][mapping[j % cwidth.length]];
                        //console.log("row num is", row_num);
                        //console.log("text_1 is", next_text_1);
                        //console.log("text_2 is", next_text_2);

                        cell(next_text_2, g, 13, k, "Full");
                        cell(next_text_1, g, 14, k, "Full");
                        cell(next_text_1, g, 23, k, "Full");
                        cell(next_text_2, g, 24, k, "Full");


                    }
                    else {
                       // clickCount +=1;
                        //changeBar();
                        //console.log("clickCount is", clickCount);
                        // var prev_text = dat[g.attr("id").slice(1) % 6][row_num][mapping[j % cwidth.length]];
                        //show text
                        // var prev_sib_text = d3.select(this.previousSibling).text();
                        var prev_text = d3.select(this).text();
                        // console.log(prev_sib_text);
                        // console.log(prev_text);
                        // prev_text = prev_text.replace("@",'');
                        // prev_text = prev_text.replace("&",'');
                        prev_text = prev_text.split("&").join("");
                        prev_text = prev_text.split("/").join("");
                        prev_text = prev_text.split("@").join("");
                        //console.log(prev_text);

                        d3.select(this.parentNode)
                            .select(otcell).remove();
                        d3.select(this).remove();

                        setTimeout(function(){   if (((mode_list[mode_list.indexOf(current_mode) + 1] == "Opti1" && title[j % cwidth.length] == "ID") || title[j % cwidth.length] == "Sex") || title[j % cwidth.length] == "Race" || prev_text.trim() === "") {
                            var next_mode = "Full";
                        } else {
                            var next_mode = mode_list[mode_list.indexOf(current_mode) + 1];
                        }

                            if (next_mode == "Full") {
                                mapping = [0, 9, 2, 3, 4, 5, 6, 7, 8, 1, 10, 11, 12, 7, 8, 15];
                            } else {
                                mapping = [0, 9, 2, 10, 11, 5, 12, 13, 14, 1, 3, 4, 6, 7, 8, 15];
                            }

                            // if(mode_list[mode_list.indexOf(current_mode) + 1] == "Opti1" && title[j%cwidth.length]=="DoB(M/D/Y)"){
                            //     cell(dat[g.attr("id").slice(1) % 6][row_num][1], g, j, 3, next_mode);
                            //     cell(dat[g.attr("id").slice(1) % 6][Math.abs(row_num-1)][1], g, j2, 3, next_mode);
                            //     cell(dat[g.attr("id").slice(1) % 6][Math.abs(row_num-1)][9], g, j2+8, 3, next_mode);
                            //     cell(dat[g.attr("id").slice(1) % 6][row_num][9], g, j+8, 3, next_mode);
                            //
                            // }


                            if (next_mode == "Full" && title[j % cwidth.length] == "ID") {
                                // console.log(dat[g.attr("id").slice(1) % 6][row_num][1]);
                                // console.log(j);
                                // console.log(dat[g.attr("id").slice(1) % 6][row_num][9]);
                                // console.log(j+8);
                                // console.log(dat[g.attr("id").slice(1) % 6][Math.abs(row_num-1)][1]);
                                // console.log(j2);
                                // console.log(dat[g.attr("id").slice(1) % 6][Math.abs(row_num-1)][9]);
                                // console.log(j2+8);
                                cell(dat[g.attr("id").slice(1) % 6][row_num][1], g, j, 3, next_mode);
                                cell(dat[g.attr("id").slice(1) % 6][Math.abs(row_num - 1)][1], g, j2, 3, next_mode);
                                cell(dat[g.attr("id").slice(1) % 6][Math.abs(row_num - 1)][9], g, j2 + 8, 3, next_mode);
                                cell(dat[g.attr("id").slice(1) % 6][row_num][9], g, j + 8, 3, next_mode);
                            } else {
                                var next_text_1 = dat[g.attr("id").slice(1) % 6][row_num][mapping[j % cwidth.length]];
                                var next_text_2 = dat[g.attr("id").slice(1) % 6][Math.abs(row_num - 1)][mapping[j % cwidth.length]];

                                cell(next_text_1, g, j, k, next_mode);
                                cell(next_text_2, g, j2, k, next_mode);


                            }},200);


                    }

                }

               }


            }


            });

        // experimentr.data()["current_cel"].attr("opacity", 0.5);


    var randomNum;
    if(j > 10) {
        if((cel.attr("data-mode") == "Partial")||(cel.attr("data-mode") == "Partial_Cell")){

            cel.on("mouseover", function(d) {
                // var cell_question_number = d3.select(this).attr("id");//findId
                // var question_number=cell_question_number.replace("c", " ");
                // var cell_pair_number = d3.select(this.parentNode).attr("id");
                // var pair_number = cell_pair_number.replace("g", " ");
                // //console.log(question_number);
                // var pair_num =parseInt(pair_number );
                // // console.log(pair_number);
                //
                // var prev_text_id = parseInt(question_number);
                // var sibling_id;
                // if(prev_text_id<20){
                //     sibling_id = "c"+(prev_text_id +10).toString();
                // }
                // else if(prev_text_id>20){
                //     sibling_id = "c"+(prev_text_id -10).toString();
                // }
                // //console.log(sibling_id);
                //
                // console.log(d3.select(this).text());
                // console.log(d3.select(this.parentNode).select("#"+sibling_id).text());

                randomNum = Math.floor((Math.random() * 6) + 12);
                preCalculatedPercentageBar(total_char,randomNum);
                var selection = d3.select(this.parentNode);
                var rect = this.getBBox();
                var x_offset = 2; // enlarge rect box 2 px on left & right side
                var y_offset = 2;
                var w = cwidth[j%cwidth.length] * 0.80;
                if (cwidth[j%cwidth.length]==60) {
                    w = cwidth[j%cwidth.length] * 1.20;
                }

                var is_swapped = false;
                if(cel.attr("swap_detect")== "true"){


                    is_swapped = true;
                }

                if(j>20 && cel.attr("swap_detect") != "true"){
                    var pathinfo_deep = [
                        {x: x - 5, y: y + 25},
                        {x: x - 5 + w, y: y + 25},
                        {x: x - 5 + w, y: y + 25 - 77}
                    ];
                    var pathinfo_light = [
                        {x: x - 5 + w, y: y + 25 - 77},
                        {x: x - 5, y: y + 25 - 77},
                        {x: x - 5, y: y + 25}
                    ];
                }
                else if(cel.attr("swap_detect")== "true" && cel.attr("id") == "c13"){
                    var pathinfo_deep = [
                        {x: x - 5 + 2.5*w, y: y - 5},
                        {x: x - 5 + 2.5*w, y: y - 5 + 77},
                        {x: x - 5, y: y - 5 + 77}
                    ];
                    var pathinfo_light = [
                        {x: x - 5, y: y - 5 + 77},
                        {x: x - 5, y: y - 5},
                        {x: x - 5 + 2.5*w, y: y - 5}
                    ];
                }
                else if(cel.attr("swap_detect")== "true" && cel.attr("id") == "c23"){
                    var pathinfo_deep = [
                        {x: x - 5 + 2.5*w, y: y - 5-47},
                        {x: x - 5 + 2.5*w, y: y - 5 + 77-47},
                        {x: x - 5, y: y - 5 + 77-47}
                    ];
                    var pathinfo_light = [
                        {x: x - 5, y: y - 5 + 77-47},
                        {x: x - 5, y: y - 5-47},
                        {x: x - 5 + 2.5*w, y: y - 5-47}
                    ];
                }
                else if(cel.attr("swap_detect")== "true" && cel.attr("id") == "c14"){
                    var pathinfo_deep = [
                        {x: x - 5 + 2.5*w - 193, y: y - 5},
                        {x: x - 5 + 2.5*w - 193, y: y - 5 + 77},
                        {x: x - 5 - 193, y: y - 5 + 77}
                    ];
                    var pathinfo_light = [
                        {x: x - 5-193, y: y - 5 + 77},
                        {x: x - 5-193, y: y - 5},
                        {x: x - 5 + 2.5*w -193, y: y - 5}
                    ];
                }
                else if(cel.attr("swap_detect")== "true" && cel.attr("id") == "c24"){
                    var pathinfo_deep = [
                        {x: x - 5 + 2.5*w - 193, y: y - 5 - 47},
                        {x: x - 5 + 2.5*w - 193, y: y - 5 + 77 - 47},
                        {x: x - 5 - 193, y: y - 5 + 77 - 47}
                    ];
                    var pathinfo_light = [
                        {x: x - 5-193, y: y - 5 + 77 -47},
                        {x: x - 5-193, y: y - 5 - 47},
                        {x: x - 5 + 2.5*w-193, y: y - 5 -47}
                    ];
                }
                else {
                    var pathinfo_deep = [
                        {x: x - 5 + w, y: y - 5},
                        {x: x - 5 + w, y: y - 5 + 77},
                        {x: x - 5, y: y - 5 + 77}
                    ];
                    var pathinfo_light = [
                        {x: x - 5, y: y - 5 + 77},
                        {x: x - 5, y: y - 5},
                        {x: x - 5 + w, y: y - 5}
                    ];
                }


                // Specify the function for generating path data
                var d3line = d3.svg.line()
                    .x(function(d){return d.x;})
                    .y(function(d){return d.y;})
                    .interpolate("linear");

                // Draw the line
                selection.append("svg:path")
                    .attr("d", d3line(pathinfo_deep))
                    .style("stroke-width", 3)
                    .style("stroke", "#f0ad4e")
                    .style("fill", "none")
                    .attr("class","highlight_rect");
                selection.append("svg:path")
                    .attr("d", d3line(pathinfo_light))
                    .style("stroke-width", 3)
                    .style("stroke", "#f0ad4e")
                    .style("fill", "none")
                    .attr("class","highlight_rect");


                //for swaped name
                //for swaped name
                if(is_swapped == true) {
                    is_swapped = false;
                }






                if(cel.attr("missing")== "true"){
                    d3.selectAll(".highlight_rect").remove();
                    preCalculatedPercentageBar(total_char,0);
                }
                else{
                    d3.select(this).style("cursor", "pointer");
                }
            });

            cel.on("mouseout", function(d){
                // console.log(-randomNum);
                preCalculatedPercentageBar(total_char,0);
                d3.select(this).style("cursor", "default");
                d3.selectAll(".highlight_rect").remove();

            });
        } else {
            cel.on({"mouseover": function(d) {
                preCalculatedPercentageBar(total_char,0);
                d3.select(this).style("cursor", "default");
            }});

            cel.on("mouseout", function(d){
                preCalculatedPercentageBar(total_char,0);
                d3.selectAll(".highlight_rect").remove();

            });
        }
    }

    var raw_t = t;

    var rectangle = cel.append("rect").attr("id",j);
    //only show rect on clickable cells
    //if(k==6 && j<2*cwidth.length){
    //    rectangle.attr("x",-5).attr("y",-5).attr("width",cx).attr("id","r"+j.toString())
    //        .attr("height",80).style("fill","#C5E3BF").attr("rx",5).attr("ry",5);
    //}
    if(index_r==0 && j<cwidth.length){
        rectangle.attr("x",0).attr("y",0).attr("width",cx+40).attr("id","r"+j.toString())
            .attr("height",function(){if(k==2||k==4){return cy*2+23;}if(k==0||k==5||(index_r>0 && k==1)){return 0;}return cy;})
            .style("fill","none")
            .style("fill",function(){if(k==1||k==2){return "#add8e6";}if(k==3||k==4){return "#b2d3e6";}if(k==6){return "#C5E3BF"}})
            .style("opacity",1);
    }

    var textbox = cel.append("text").attr("class","tbox").attr("id","t"+j.toString());
    textbox.attr("x",function(){
        //if(k==3 && (title[j%10]=="FFreq"||title[j%10]=="LFreq"||
        //title[j%10]=="ID.")){return cx/2;}
        if(t=="ID"){return 18;}
        if(t=="Race"){return 20;}
        if(t=="Sex"){return 20;}
        if(title[j%cwidth.length]=="Sex" && mode=="Vanilla"){return "2em";}
        if(j>cwidth.length && title[j%cwidth.length]=="Race"){return "2em";}
        if(k==2){return cx/2;}
        return 0;})
    //if(t.length>0){return cx*(0.02+0.48/t.length)-4;}})
        .attr("y",function(){if(k==2){return cy/2+28;}if(k==1||k==3||k==4||k==5||k==6){return cy/2+5;}})
        .attr("text-anchor",function(){
            //if(k==3 && (title[j%10]=="FFreq"||title[j%10]=="LFreq"||j%10==0||
            //title[j%10]=="ID.")){return "middle";}
            if(k==2){return "middle";}
            // || title[j%cwidth.length]=="Race"
            return "left";})
        .style("font",function(){
            if(experimentr.data()['os']=="MacOS"){return "16px Monaco";}
            if(experimentr.data()['os']=="Linux"){return "16px Lucida Sans Typewriter";}
            return "16px Lucida Console";})//.style("font-weight","bold")
        .text(function(){
            if(title[j%cwidth.length]=="ID."){return " ";}
            else if(k==0||(index_r>0 && k==1)){return " ";}
            else if(k==3 && (title[j%cwidth.length]=="FFreq"||title[j%cwidth.length]=="LFreq")){return "";}
            return t;
        }).style("fill", function(){if(j>=cwidth.length && j%cwidth.length<1){return "grey";}});
    if(k==1){
        textbox.style("font-weight","bold");
    }

    // icons
    var indel = [],
        replace = [],
        transpose = [],
        indel_ = [],
        replace_ = [],
        transpose_ = [],
        trailing = [],
        trailing_ = [],
        date_swap = 0,
        diff = 0,
        swap = 0;

    if(j>cwidth.length){
        //icons for frequency
        if(k==3 && (title[j%cwidth.length]=="FFreq"||title[j%cwidth.length]=="LFreq")) {
            var div = cel.append("g").style("opacity",0);
            var bg = div.append("rect").style("fill","none").attr("x",-2).attr("y",-14).attr("width",0).attr("height",20)
                .attr("stroke", "grey")
                .attr("stroke-width",1);
            var tip = div.append("text").attr("class","tip").style("fill","grey").attr("text-anchor", "left");

            if(t==1){
                cel.append("svg:image").attr("xlink:href","/resources/unique.png").attr("class","freq")
                    .attr("x",10).attr("y",cy/2-9).attr("width",20).attr("height",20);
                tip.text('Unique Name');
                bg.attr("width",90);
            } else {
                if(t<=5) {
                    // cel.append("svg:image").attr("xlink:href","/resources/rare.svg").attr("class","icon")
                    //     .attr("x",cwidth[j%cwidth.length]/3).attr("y",cy/2-9).attr("width",20).attr("height",20);
                    cel.append("svg:image").attr("xlink:href","/resources/rare_2_rect.svg").attr("class","freq")
                        .attr("x",10).attr("y",cy/2-9).attr("width",22).attr("height",22);
                    tip.text('Rare Name');
                    bg.attr("width",80);
                } else {
                    if(t<=100) {
                        cel.append("svg:image").attr("xlink:href", "/resources/3_dots.png").attr("class", "freq")
                            .attr("x", 10).attr("y", cy / 2 - 9).attr("width", 20).attr("height", 20);
                        tip.text('Occurred Often');
                        bg.attr("width",100);
                    } else {
                        cel.append("svg:image").attr("xlink:href", "/resources/infinity.png").attr("class", "freq")
                            .attr("x", 10).attr("y", cy / 2 - 9).attr("width", 20).attr("height", 20);
                        tip.text('Common Name');
                        bg.attr("width",100);
                    }
                }
            }
            if(mode!='Vanilla'){
                cel.on("mouseover",function(d){
                    div.style("opacity",1);
                });
                cel.on("mouseout",function(d){
                    div.style("opacity",0);
                });
            }
            if(mode!='Vanilla'){
                if(mode!='Vanilla'){experimentr.data()['freq']+=1;}
            }
        }
        // check if it's a name swap
        if(mode!='Vanilla' && title[j%cwidth.length]=="First name"||title[j%cwidth.length]=="Last name"){
            var m = j+cwidth.length,
                p = g.attr("id").slice(1),
                dat = experimentr.data()[experimentr.data()['section']][Math.floor(p/6)],
                fnj = "",
                fnm = "",
                lnj = "",
                lnm = "";
            //console.log(dat[p%6]);
            if(title[j%cwidth.length]=="First name"){
                fnj = dat[p%6][0][mapping[mapping[j%cwidth.length]]];
                fnm = dat[p%6][1][mapping[mapping[m%cwidth.length]]];
                lnj = dat[p%6][0][mapping[mapping[j%cwidth.length+1]]];
                lnm = dat[p%6][1][mapping[mapping[m%cwidth.length+1]]];
            }
            if(title[j%cwidth.length]=="Last name"){
                fnj = dat[p%6][0][mapping[mapping[j%cwidth.length-1]]];
                fnm = dat[p%6][1][mapping[mapping[m%cwidth.length-1]]];
                lnj = dat[p%6][0][mapping[mapping[j%cwidth.length]]];
                lnm = dat[p%6][1][mapping[mapping[m%cwidth.length]]];
            }

            if(fnj==lnm && fnm==lnj){
                swap = 1;
                if(j<2*cwidth.length && title[j%cwidth.length]=="First name"){
                    console.log(2*cwidth.length,"2*cwidth.length is");
                    cel.append("svg:image").attr("xlink:href","/resources/name_swap.svg").attr("class","icon")
                        .attr("x",cwidth[j%cwidth.length]-45).attr("y",cy/2-8).attr("width",60).attr("height",60);
                    if(mode != "Full"){
                        cel.attr("swap_detect",true);
                        // cel.attr("id","c23");
                        // cel.attr("swap_detect",true);
                        // console.log(cel,"see 23");
                        cel.attr("id","c13");
                    }


                    }
                else if ( title[j%cwidth.length]=="First name"){
                    if(mode != "Full"){
                        cel.attr("swap_detect",true);
                        cel.attr("id","c23");
                    }
                }
                else if(j<2*cwidth.length && title[j%cwidth.length]=="Last name"){
                    if(mode != "Full"){
                        cel.attr("swap_detect",true);
                        cel.attr("id","c14");
                    }
                }
                else if(title[j%cwidth.length]=="Last name"){
                    if(mode != "Full"){
                        cel.attr("swap_detect",true);
                        cel.attr("id","c24");
                    }
                }





                if(["Vanilla","Full"].indexOf(mode)<0){
                    t = t.replace(/[A-Z0-9]/g, function(){if(j%14>9){return "&";}return "@";});
                }
                if(mode!='Vanilla'){experimentr.data()['nswap']+=0.25};
            }
            //console.log(j, fnj, fnm, lnj, lnm);
        }
        if(textbox.text()==""){
            if(title[j%cwidth.length]!="FFreq" && title[j%cwidth.length]!="LFreq"){
                // missing
                cel.attr("missing","true");
                cel.append("svg:image").attr("xlink:href","/resources/missing.png").attr("class","icon")
                    .attr("x",function(){
                        if(title[j%cwidth.length]=="ID"){return 36;}
                        if(title[j%cwidth.length]=="Race"){return 28;}
                        else if(title[j%cwidth.length]!="DoB(M/D/Y)"){return cwidth[j%cwidth.length]/3;}
                        return 40;})
                    .attr("y",cy/2-9).attr("width",18).attr("height",18);
                if(mode!='Vanilla'){experimentr.data()['missing']+=1;}
            }
        }
        //else if(textbox.text()==" " && j<cwidth.length*2){
        //    // check mark
        //    cel.append("svg:image").attr("xlink:href","/resources/checkmark.png").attr("class","icon")
        //        .attr("x",function(){if(title[j%cwidth.length]!="DoB(M/D/Y)"){return cwidth[j%cwidth.length]/3;}return 40;})
        //        .attr("y",cy/2+15).attr("width",18).attr("height",18);
        else if(textbox.text()==" " && title[j%cwidth.length]!="ID." && title[j%cwidth.length]!="Pair"){
            // double check mark
            cel.append("svg:image").attr("xlink:href","/resources/checkmark.png").attr("class","icon")
                .attr("x",function(){if(title[j%cwidth.length]=="First name"||title[j%cwidth.length]=="Last name"){return 10;}
                else if(title[j%cwidth.length]=="ID"){return 35;}
                else if(title[j%cwidth.length]!="DoB(M/D/Y)"){return cwidth[j%cwidth.length]/3;}
                    return 40;})
                .attr("y",cy/2-5).attr("width",18).attr("height",18);
            if(mode!='Vanilla'){experimentr.data()['checks']+=0.5;}
        }else {
            var num = 0;
            if (swap == 0 && title[j % cwidth.length] != "ID." && title[j % cwidth.length] != "FFreq" && title[j % cwidth.length] != "LFreq") {
                var m = j + cwidth.length,
                    p = g.attr("id").slice(1),
                    dat = experimentr.data()[experimentr.data()['section']][Math.floor(p / 6)],
                    t_j = dat[p % 6][0][mapping[j % cwidth.length]],
                    t_m = dat[p % 6][1][mapping[m % cwidth.length]],
                    bin = [];

                if(mode=="Full" && (title[j % cwidth.length] == "Sex"||title[j % cwidth.length] == "Race"||title[j % cwidth.length] == "First name"||title[j % cwidth.length] == "Last name"
                        ||title[j % cwidth.length] == "DoB(M/D/Y)")){//fix diff icon location

                    if(t_j != t_m && !(t_j=="" || t_m=="")){
                        if (j < 2 * cwidth.length) {
                            g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/diff.svg")
                                .attr("class", "icon")
                                .attr("x", 17)
                                .attr("y", cy / 2 + 5).attr("width", 35).attr("height", 35);
                        }
                    }
                } else {
                    if (title[j % cwidth.length] != "Pair" && t_j.indexOf("*") == -1 && t_m.indexOf("*") == -1 && t_j.trim() != "" && t_m.trim() != "") {
                        //var len = (t_j.length<=t_m.length?t_j.length:t_m.length)/2;
                        //console.log(t_j, t_m);
                        diff = 1;
                        if (j < 2 * cwidth.length) {
                            g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/diff.svg")
                                .attr("class", "icon")
                                .attr("x", function () {
                                    if (title[j % cwidth.length] == "First name" || title[j % cwidth.length] == "Last name") {
                                        return 0;
                                    }
                                    else if (title[j % cwidth.length] == "DoB(M/D/Y)") {
                                        return 25;
                                    }
                                    else if (title[j % cwidth.length] == "ID") {
                                        return 28;
                                    } else if (title[j % cwidth.length] == "Sex") {
                                        return 17;
                                    }
                                    return 20;
                                })
                                .attr("y", cy / 2 + 5).attr("width", 35).attr("height", 35);
                            if(mode!='Vanilla'){experimentr.data()['diff']+=1;}
                        }
                    } else {
                        if (t_j != "" && t_m != "") {
                            for (var i = 0; i < Math.max(t_j.length, t_m.length); i++) {
                                // date swap
                                if (i == 0 && bin.indexOf(i) == -1 && t_j[i] == t_m[i + 3] && t_j[i + 1] == t_m[i + 4] && t_j[i + 3] == t_m[i] &&
                                    t_j[i + 4] == t_m[i + 1] && t_j[i] != "*" && t_j[i + 1] != "*" && t_j[i + 2] != "*" && t_j[i + 3] != "*") {
                                    //console.log(t_m, t_j);
                                    bin.push(i, i + 1, i + 2, i + 3, i + 4);
                                    if (j < 2 * cwidth.length) {
                                        g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/swap_date.svg")
                                            .attr("class", "icon").attr("x", 9 * i + 12)
                                            .attr("y", cy / 2 + 13).attr("width", 23).attr("height", 23);
                                    }
                                    if(mode!='Vanilla'){experimentr.data()['dswap']+=0.5;}
                                    date_swap = 1;
                                    num += 1
                                }
                                //indel
                                else if ((t_j[i] == "_" && t_m[i] != "_") || (t_j[i] != "_" && t_m[i] == "_")) {
                                    bin.push(i);
                                    if ((t_j[i] == "_" && t_m[i] != "_") || i > t_j.length) {
                                        indel_.push(i);
                                    }
                                    if ((t_j[i] != "_" && t_m[i] == "_") || i > t_m.length) {
                                        indel.push(i);
                                    }
                                    if(mode!='Vanilla'){experimentr.data()['indel']+=1;}
                                    //g.select("#c"+j.toString()).append("svg:image").attr("xlink:href","/resources/indel.png")
                                    //    .attr("class","icon").attr("x",9*i)
                                    //    .attr("y",cy/2+15).attr("width",16).attr("height",16);
                                }
                                //transpose
                                else if (bin.indexOf(i) == -1 && t_j[i] == t_m[i + 1] && t_j[i + 1] == t_m[i] && t_j[i] != "*" && t_m[i] != "*"
                                    && t_j[i + 1] != "*" && t_m[i + 1] != "*" && t_j[i] == t_m[i + 1] && t_j[i] != t_j[i + 1]) {
                                    //console.log(t_m, t_j);
                                    bin.push(i, i + 1);
                                    if (j < 2 * cwidth.length) {
                                        g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/transpose.png")
                                            .attr("class", "icon").attr("x", 9 * i + 4)
                                            .attr("y", cy / 2 + 13).attr("width", 18).attr("height", 18);
                                    }
                                    if(mode!='Vanilla'){experimentr.data()['transpose']+=1;}
                                    transpose.push(i, i + 1);
                                    transpose_.push(i, i + 1);
                                    num += 1;
                                }

                                //replace
                                else if (bin.indexOf(i) == -1 && t_j[i] != t_m[i] && t_j[i] != " " && t_m[i] != " ") {
                                    if (title[j % cwidth.length] != "ID" || (title[j % cwidth.length] == "ID" &&
                                            (j < 10 || Math.max(t_j.length, t_m.length) <= 10))) {
                                        bin.push(i);
                                        replace.push(i);
                                        replace_.push(i);
                                        if(mode!='Vanilla'){experimentr.data()['replace']+=1;}
                                    } else {
                                        if (t_m[i] == "?" || t_j[i] == "?") {
                                            bin.push(i);
                                            trailing.push(i);
                                            trailing_.push(i);
                                        }
                                    }
                                }
                            }
                        }

                        // reduce duplicate icons
                        var _indel = [],
                            _replace = [],
                            __indel = [],
                            __replace = [];

                        for (var i = 0; i < indel.length; i++) {
                            //console.log(indel.indexOf(indel[i]-1));
                            if (indel.indexOf(indel[i] - 1) == -1) {
                                _indel.push([indel[i]]);
                            } else {
                                _indel[_indel.length - 1].push(indel[i]);
                            }
                        }

                        for (var i = 0; i < indel_.length; i++) {
                            //console.log(indel.indexOf(indel[i]-1));
                            if (indel_.indexOf(indel_[i] - 1) == -1) {
                                _indel.push([indel_[i]]);
                            } else {
                                _indel[_indel.length - 1].push(indel_[i]);
                            }
                        }

                        for (var i = 0; i < _indel.length; i++) {
                            __indel.push(_indel[i].reduce((previous, current) => current += previous) / _indel[i].length);
                        }

                        for (var i = 0; i < replace.length; i++) {
                            //console.log(replace.indexOf(replace[i]-1));
                            if (replace.indexOf(replace[i] - 1) == -1) {
                                _replace.push([replace[i]]);
                            } else {
                                _replace[_replace.length - 1].push(replace[i]);
                            }
                        }

                        for (var i = 0; i < _replace.length; i++) {
                            __replace.push(_replace[i].reduce((previous, current) => current += previous) / _replace[i].length);
                        }
                        if (j < 2 * cwidth.length) {
                            for (var i = 0; i < __indel.length; i++) {
                                g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/indel.png")
                                    .attr("class", "icon").attr("x", 9 * __indel[i] + "px")
                                    .attr("y", cy / 2 + 16).attr("width", 13).attr("height", 13);
                                num += 1;
                            }

                            for (var i = 0; i < __replace.length; i++) {
                                g.select("#c" + j.toString()).append("svg:image").attr("xlink:href", "/resources/replace.png")
                                    .attr("class", "icon").attr("x", 9 * __replace[i] + "px")
                                    .attr("y", cy / 2 + 16).attr("width", 13).attr("height", 13);
                                num += 1;
                            }
                        }
                        //if(bin.length>0){
                        //    console.log(indel, replace);
                        //}
                        //console.log(num);
                    }
                }
            }
        }
    }

    //date swap with special charecters
    if(date_swap==1 && mode=="Partial"){
        if(j<2*cwidth.length){
            t = t.slice(0,3)+'&&'+t.slice(5);
        }else{
            t = t.slice(0,3)+'@@'+t.slice(5);
        }
        //console.log(t);
    }

    if(j<2*cwidth.length && textbox.text()=="  "){
        g.select("#c"+j.toString()).selectAll(".icon").remove();
        //    cel.append("svg:image").attr("xlink:href","/resources/replace.png").attr("class","icon")
        //        .attr("x",cwidth[j%cwidth.length]/5).attr("y",cy/2).attr("width",48).attr("height",48);
    }


    // indel, indel_, replace, replace_, transpose, transpose_
    // coloring '@' and '#'
    if(diff==1){
        indel=[];
        indel_=[];
        replace=[];
        replace_=[];
        transpose = [];
        transpose_ = [];

        // replace display content to special symbols '@', '&'
        if(["Full","Vanilla","Opti1"].indexOf(mode)<0 && title[j%cwidth.length]=="Race"){
            if(j>2*cwidth.length){t = '&';}
            else if(j>cwidth.length){t = '@';}
        }
        if(["Vanilla","Full", "Opti2"].indexOf(mode)<0 && title[j%cwidth.length]=="ID" && t!=" "){
            if(j>2*cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '&');}
            else if(j>cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '@');}
        }
        if(["Vanilla","Full", "Opti1", "Opti2"].indexOf(mode)<0 &&
            ["First name", "Last name", "DoB(M/D/Y)","Race"].indexOf(title[j%cwidth.length])>-1 && t!=" "){
            if(j>2*cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '&');}
            else if(j>cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '@');}
        }
    }

    if((mode!="Vanilla") && k>=3 && k<=6 &&
        title[j%cwidth.length]!="ID." && title[j%cwidth.length]!="LFreq" && title[j%cwidth.length]!="FFreq"){
        g.select("#c"+j.toString()).select(".span").remove();
        var p = g.attr("id").slice(1), //pair id
            dat = experimentr.data()[experimentr.data()['section']][Math.floor(p/6)],
            m = j>=2*cwidth.length ? j-cwidth.length : j+cwidth.length,
            //len = textbox.text().length,
            len = t.length,
            $cel = g.select("#c"+j.toString()),
            $tb = $cel.append("text").attr("class","span"),
            t_j = j<2*cwidth.length ? dat[p%6][0][mapping[j%cwidth.length]] : dat[p%6][1][mapping[j%cwidth.length]],
            t_m = m<2*cwidth.length ? dat[p%6][0][mapping[m%cwidth.length]] : dat[p%6][1][mapping[m%cwidth.length]],
            t_jj = j<2*cwidth.length ? dat[p%6][0][j%cwidth.length] : dat[p%6][1][j%cwidth.length],
            scheme = [];
        for(var l=0;l<len;l++){
            if(t_j[l]==t_m[l] && t_j[l]!='T' && t_j[l]!='X'){scheme.push(0);}
            else{scheme.push(1);}
        }
        if(j>cwidth.length && diff==0 && mode=='Opti1' &&
            ['First name', 'Last name', 'DoB(M/D/Y)'].indexOf(title[j%cwidth.length])>-1){
            if(t.indexOf('*')>-1 && t_m!="" && t_j!=""){
                t = t_jj;

            }

        }

        if(mode=='Partial' && t!=" "){

            if(j>2*cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '&');}
            else if(j>cwidth.length){t = t.replace(/[A-Z0-9]|\040|\'|\-/g, '@');}
        }

        var t_count = 0;
        for(var l=0;l<len;l++){
            if(t[l]!="_"){
                var $tspan = $tb.append('tspan').attr("class","char");
                $tspan.attr("x",function(){
                    if(title[j%cwidth.length]=="Race" ){return "2em";}
                    if(title[j%cwidth.length]=="Sex" ){return "1.75em";}
                    return 9*t_count+"px";
                }).attr("y",cy/2+5)
                    .style("font",function(){
                        if(experimentr.data()['os']=="MacOS"){return "16px Monaco";}
                        if(experimentr.data()['os']=="Linux"){return "16px Lucida Sans Typewriter";}
                        return "16px Lucida Console";})
                    .style("font-weight",function(){if(diff==0 &&
                        (((j<2*cwidth.length && indel.indexOf(l)>-1)||(j>2*cwidth.length && indel_.indexOf(l)>-1))||
                            (j<2*cwidth.length && replace.indexOf(l)>-1)||(j>2*cwidth.length && replace_.indexOf(l)>-1)||
                            (j<2*cwidth.length && transpose.indexOf(l)>-1)||(j>2*cwidth.length && transpose_.indexOf(l)>-1)||
                            (j<2*cwidth.length && trailing.indexOf(l)>-1)||(j>2*cwidth.length && trailing_.indexOf(l)>-1))){return "bold";}})
                    .attr("fill",function(){
                        if((j<2*cwidth.length && indel.indexOf(l)>-1)||(j>2*cwidth.length && indel_.indexOf(l)>-1)||
                            (j<2*cwidth.length && trailing.indexOf(l)>-1)||(j>2*cwidth.length && trailing_.indexOf(l)>-1)){return "#33ce45";}
                        else if((j<2*cwidth.length && replace.indexOf(l)>-1)||(j>2*cwidth.length && replace_.indexOf(l)>-1)){return "#9b3d18";}
                        else if((j<2*cwidth.length && transpose.indexOf(l)>-1)||(j>2*cwidth.length && transpose_.indexOf(l)>-1)){return "#009fff";}
                        return "black";})
                    .text(function(){if(t[l]=="?"){return "";}return t[l];});
                t_count+=1;
            }
        }
        g.select("#t"+j.toString()).remove();

    }

}


/**
 * draw a row
 * @param t : text list
 * @param g : svg
 * @param j : row number 0/1/2
 * @param k : cell type list
 */
function row(t,g,j,k, mode){

    var l = 0;
    for(var i=0;i<cwidth.length;i++){
        if(k[i]!=9){
            // console.log("The t is ",t[mapping[i]]);
            if(title[i%cwidth.length]=="Sex" && k[i]!=1){
                if(mode=="Partial") {
                    cell(t[i],g,j*cwidth.length+l,k[i], mode, t[mapping[i]]);
                } else {
                    cell(t[mapping[i]],g,j*cwidth.length+l,k[i],mode, t[mapping[i]]);
                }
            } else {
                cell(t[i],g,j*cwidth.length+l,k[i],mode, t[mapping[i]]);
            }
            l+=1;
        }
    }
}


/**
 * draw a pair
 * @param t:text
 * @param g:svg
 * @param m:mode
 */
function pair(t,g,m){
    var a = cwidth.length,
        b = cwidth.length+mapping.length,
        c = cwidth.length+2*mapping.length;
    var k = new Array(c).fill(1);

    k[a] = 2;
    k[b] = 0;
    var row1 = t.slice(a,b),
        row2 = t.slice(b,c),
        k1 = k.slice(a,b),
        k2 = k.slice(b,c);

    if(m=="Vanilla" || m=="Full"){

        mapping = [0,9,2,10,11,5,12,7,14,1,3,4,6,7,8,15];
    } else{
        mapping = [0,9,2,10,11,5,12,13,14,1,3,4,6,7,8,15];
    }

    if(m=="Partial"){
        for(var j=1;j<mapping.length;j++){
            k[a+j] = j<a ? 3:9; k[b+j] = j<a ? 3:9;
        }
        row1 = t.slice(a,b);row2 = t.slice(b,c);
        k1 = k.slice(a,b);k2 = k.slice(b,c);


        for(var j=0;j<mapping.length;j++){
            row1[j] = t[a+mapping[j]];row2[j] = t[b+mapping[j]];
        }


        for(var j = 0;j<a;j++){

            if(title[j] != "FFreq" && title[j] != "LFreq" && title[j] != "Pair" && title[j] != "ID."){
                if(row1[j] == row2[j] && row1[j]!=""){
                    if(['ID', 'Last name', 'First name', 'DoB(M/D/Y)', 'Sex', 'Race'].indexOf(title[j%cwidth.length])>-1){
                        experimentr.data()["no_display"]+=row1[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g)?
                            row1[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length:0;
                        experimentr.data()["no_display"]+=row2[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g)?
                            row2[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length:0;
                    }
                    row1[j] = " ";
                    row2[j] = " ";
                } else {
                    if(row1[j]=="" && row2[j]!=""){row2[j] = row2[j].replace(/[A-Z0-9]|\040|\'|\-/g, '*');}
                    if(row2[j]=="" && row1[j]!=""){row1[j] = row1[j].replace(/[A-Z0-9]|\040|\'|\-/g, '*');}
                    //row1[j] = row1[j].replace(/[A-Z0-9]/g, '@');
                    //row2[j] = row2[j].replace(/[A-Z0-9]/g, '&');
                }
            }
        }
    }
    else if(m=="Vanilla"){
        for(var j=1;j<mapping.length;j++){
            k[a+j] = j<a ? 3:9; k[b+j] = j<a ? 3:9;
        }
        k1 = k.slice(a,b);k2 = k.slice(b,c);
        for(var j=2;j<a;j++){
            if(title[j] == "FFreq" || title[j] == "LFreq"){
                t[j] = " "; row1[j] = " "; row2[j] = " ";
            }
        }
        //console.log(row1, row2);
    }
    else if(m=="Full"){
        for(var j=1;j<mapping.length;j++){
            k[a+j] = j<a ? 3:9;k[b+j] = j<a ? 3:9;
            if(j<cwidth.length){
                if(["First name", "Last name", "ID"].indexOf(title[j%cwidth.length])>-1){
                    //console.log(t[a+j].length, t[a+mapping[j]].length, t[b+j].length, t[b+mapping[j]].length);
                    if(row1[j].length!=row1[mapping[j]].length){
                        for(var i=0;i<row1[mapping[j]].length;i++){
                            if(row1[mapping[j]][i]=="_"){
                                row1[j] = row1[j].slice(0,i)+"_"+row1[j].slice(i)
                            }
                        }
                        //console.log(row1[j], row1[mapping[j]]);
                    }
                    if(row2[j].length!=row2[mapping[j]].length){
                        for(var i=0;i<row2[mapping[j]].length;i++){
                            if(row2[mapping[j]][i]=="_"){
                                row2[j] = row2[j].slice(0,i)+"_"+row2[j].slice(i)
                            }
                        }
                        //console.log(row2[j], row2[mapping[j]]);
                    }

                }
            }
        }
        k1 = k.slice(a,b);k2 = k.slice(b,c);
    }else{
        // var mapping = [0,1,3,8,9,5,10,11,2,4,6,7];
        for(var j=0;j<mapping.length;j++){
            row1[j] = t[a+mapping[j]];row2[j] = t[b+mapping[j]];
        }
        //console.log(row1, row2);
        k1[0] = 2;k2[0] = 0;
        if(m=="Hidden"){
            for(var j=1;j<mapping.length;j++){
                k1[j] = j<a ? 3:9;k2[j] = j<a ? 3:9;
                if(j>0 && j<a && title[j] != "FFreq" && title[j] != "LFreq" && row1[j]==row2[j] && row1[j]!=""){
                    k1[j] = 4;k2[j] = 5;
                }
            }
        }

        if(m=="Opti2"||m=="Opti1"){
            for(var j=1;j<mapping.length;j++){
                k1[j] = j<a ? 3:9;k2[j] = j<a ? 3:9;
                if(j>0 && j<a && title[j] != "FFreq" && title[j] != "LFreq" && row1[j]==row2[j] && row1[j]!=""){
                    k1[j] = 4;k2[j] = 5;
                }
            }

            for(var j = 0;j<a;j++){
                if(title[j] != "FFreq" && title[j] != "LFreq" && title[j] != "Pair" && title[j] != "ID."){
                    if(row1[j] == row2[j] && row1[j]!=""){
                        if(['ID', 'Last name', 'First name', 'DoB(M/D/Y)', 'Race'].indexOf(title[j%cwidth.length])>-1){
                            experimentr.data()["no_display"]+=row1[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length;
                            experimentr.data()["no_display"]+=row2[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length;
                        }
                        row1[j] = " ";
                        row2[j] = " ";
                    }else if(row1[j]==""){
                        row2[j] = row2[j].replace(/[A-Z0-9]|\040|\'|\-/g, "*");
                    }else if(row2[j]==""){
                        row1[j] = row1[j].replace(/[A-Z0-9]|\040|\'|\-/g, "*");
                    }
                }
            }
            //console.log(row1, row2);
        }
        if(m=="Partial_Row"||m=="Partial_Cell"){
            for(var j=1;j<mapping.length;j++){
                k1[j] = j<a ? 3:9;k2[j] = j<a ? 3:9;
                if(j>0 && j<a && title[j] != "FFreq" && title[j] != "LFreq" && row1[j]==row2[j] && row1[j]!=""){
                    k1[j] = 4;k2[j] = 5;
                }
                if(j>1 && j<a && title[j] != "FFreq" && title[j] != "LFreq" && row1[j]!=row2[j] && row1[j]!="" && row2[j]!=""){
                    k1[j] = 6;k2[j] = 6;
                }
            }

            //for check mark
            for(var j = 0;j<a;j++){
                if(title[j] != "FFreq" && title[j] != "LFreq" && title[j] != "Pair" && title[j] != "ID."){
                    if(row1[j] == row2[j] && row1[j]!=""){
                        if(['ID', 'Last name', 'First name', 'DoB(M/D/Y)', 'Race'].indexOf(title[j%cwidth.length])>-1){
                            experimentr.data()["no_display"]+=row1[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length;
                            experimentr.data()["no_display"]+=row2[mapping[j%cwidth.length]].match(/[A-Z0-9]|\040|\'|\-\./g).length;
                        }
                        row1[j] = " ";
                        row2[j] = " ";
                    }else if(row1[j]==""){
                        row2[j] = row2[j].replace(/[A-Z0-9]/g, "*");
                    }else if(row2[j]==""){
                        row1[j] = row1[j].replace(/[A-Z0-9]/g, "*");
                    }
                }
            }
        }
    }
    var id = g.attr("id").slice(1)%6;
    if(id%2==1){
        var bg = g.append("rect").attr("id",j).attr("height", 120).attr("width", 1800).attr("y", 10).style("fill", "#eaf2ff");
    }
    if(id==0){
        row(t.slice(0,a),g,0,k.slice(0,a),m);
    }
    // console.log(row1);
    // console.log(row2);
    row(row1,g,1,k1,m);
    row(row2,g,2,k2,m);
}


/**
 * draw multiple pairs
 * @param t : data
 * @param s : step
 * @param n : number of pairs
 * @param m : mode
 */
function pairs(t,s,n,m) {
    // console.log(t);
    var num = n;
    var len = 0;
    for(var i=0;i<n;i++){
        var pr = t[i];
        var ls_1 = pr[0][9].length;
        var ls_2 = pr[1][9].length;
        var cur_len = ls_1 >= ls_2 ? ls_1:ls_2;
        len = len >= cur_len ? len:cur_len;
    }

    // var mode = ["Partial", "Partial_Cell", "Opti1", "Full"];
    for(var i=0;i<n;i++){
        var g = d3.select("#table").append("svg").attr("class","blocks").attr("id","g"+(s*6+i).toString())
            .attr("width", 1800).attr("height", function(){if(i==0){return 140;}return 120;});
        t[i][0] = t[i][0].slice(0,t[i][0].length-2);
        t[i][1] = t[i][1].slice(0,t[i][1].length-2);

        pair(title.concat(t[i][0]).concat(t[i][1]),g,m);
        if(i==0){
            choices(g,1450,1,1,40);
            // var panel = g.append("g").attr("id","panel").attr("transform","translate(920,0)");
            var panel = g.append("g").attr("id","panel").attr("transform","translate(1350,0)");

            // var re = panel.append("rect").attr("x",30).attr("height",24).attr("width",320).style("fill","add8e6");
            var re = panel.append("rect").attr("x",-20).attr("height",24).attr("width",570).style("fill","add8e6");

            var te = panel.append("text")
                .attr("x",170)
                .attr("y",17)
                .text("Choice Panel")
                .style("font",function(){
                    if(experimentr.data()['os']=="MacOS"){return "16px Monaco";}
                    if(experimentr.data()['os']=="Linux"){return "16px Lucida Sans Typewriter";}
                    return "16px Lucida Console";})
                .style("font-weight","bold")
                .attr("text-anchor","left")
                .attr("fill","black");
        }else{
            choices(g,1450,1,1,20);
        }
    }
}

// draw choice panel
// mode: 1=default 2=introduce
function choices(svg, lBound, scale, mode, yt) {
    var options = ["Highly Likely Different",
        "Moderately Likely Different",
        "Less Likely Different",
        "Less Likely Same",
        "Moderately Likely Same",
        "Highly Likely Same"];
    var x = [20, 60, 100, 140, 180, 220];
    var lx = [10, 20, 38, 60, 78, 100, 118, 140, 158, 180, 198, 220, 238, 250];
    var y = 37;
    // add buttons
    var buttons = svg.append("g").attr("transform", "translate(" + lBound + ","+yt+")").attr("class","choice_panel");
    //buttons.append("rect").attr("x",-10*scale).attr("y",0).attr("width",280*scale).attr("height",85*scale).style("fill","#68a7ca").style("opacity",1);
    if(mode!=2){
        buttons.append("text").attr("x", 220 * scale).attr("y", 78 * scale).text("Same").attr("text-anchor", "middle").style("font", 16 * scale + "px sans-serif").attr("id","lbl_same");
        buttons.append("text").attr("x", 50 * scale).attr("y", 78 * scale).text("Different").attr("text-anchor", "middle").style("font", 16 * scale + "px sans-serif").attr("id","lbl_diff");
    }
    for (var p = 0; p < options.length; p++) {
        buttons.append("text").attr("id","labelText"+p.toString())
            .attr("x", (x[p] + 8) * scale).attr("y", function(){if(mode==2 && p%2==1){return 66*scale;}return 30 * scale;})
            .text(function(){if(mode==2){return options[p];}return options[p][0];})
            .attr("text-anchor", "middle").style("font", function(){if(mode==2){return 14+"px sans-serif";}return 16 * scale + "px sans-serif";});
    }
    //arrows
    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");
    for(var pos=0;pos<7;pos++){
        var lineData = [{"x": lx[2*pos]*scale, "y": 44*scale+4*(scale-1)}, {"x": lx[2*pos+1]*scale, "y": 44*scale+4*(scale-1)}];

        buttons.append("path").attr("d", lineFunction(lineData))
            .attr("stroke", "black")
            .attr("stroke-width", 5)
            .style("fill","none");
    }
    // separator
    if(mode==1){
        var separator = [{"x":130, "y":32},{"x":130,"y":55}];
        buttons.append("path").attr("d",lineFunction(separator)).attr("stroke", "black").attr("stroke-width", 3).style("fill","none");
    }

    var xScale = d3.scale.linear();
    var yScale = d3.scale.linear();
    var leftTrianglePoints = xScale(0) + ' ' + yScale(48*scale-4) + ', ' + xScale(10*scale) + ' ' + yScale(42*scale-4) +
        ', ' + xScale(10*scale) + ' ' + yScale(54*scale-4) + ' ' + xScale(10*scale) + ', ' + yScale(54*scale-4) + ' ' +
        xScale(0) + ' ' + yScale(48*scale-4);
    var rightTrianglePoints = xScale(260*scale) + ' ' + yScale(48*scale-4) + ', ' + xScale(250*scale) + ' ' +
        yScale(42*scale-4) + ', ' + xScale(250*scale) + ' ' + yScale(54*scale-4) + ' ' + xScale(250*scale) + ', ' +
        yScale(54*scale-4) + ' ' + xScale(260*scale) + ' ' + yScale(48*scale-4);
    buttons.append('polyline')
        .attr('points', leftTrianglePoints).attr("stroke","none").style('fill', 'black');
    buttons.append('polyline')
        .attr('points', rightTrianglePoints).attr("stroke","none").style('fill', 'black');

    var sec = experimentr.data()['section'];
    var clk = '';
    if(sec=='mat'){clk='clicks';}
    if(sec=='practice'){clk='practice_clicks';}
    if(sec=='practice2'){clk='practice2_clicks';}
    if(sec=='section2'){clk='s2_clicks';}
    for(var m=0;m<6;m++){
        var radioButton = buttons.append("g").attr("transform","translate("+x[m]*scale+","+y*scale+")");
        radioButton.append("svg:image").attr("xlink:href","/resources/0.png").attr("class","choice").attr("id",m)
            .attr("x",0).attr("y",-5).attr("width",18*scale).attr("height",25*scale);
        radioButton.on({"mouseover": function(d) {
            d3.select(this).style("cursor", "pointer")},
            "mouseout": function(d) {d3.select(this).style("cursor", "default")}})
            .on("click",function(d){
                buttons.select(".no").attr("opacity",0.2);
                buttons.selectAll(".choice").attr("xlink:href","/resources/0.png");
                d3.select(this).select("image").attr("xlink:href","/resources/1.png");
                var t = Date.now();
                // window.alert(d3.select(this).select(".choice").attr("id"));
                var choice = parseInt(d3.select(this).select(".choice").attr("id"));
                if(choice<3){
                    buttons.select("#selection_rect").remove();
                    buttons.append("rect")
                        .attr("x",13)
                        .attr("y",60)
                        .attr("width",75)
                        .attr("height",25)
                        .style("fill","none")
                        .style("stroke","#CC1100")
                        .style("stroke-width","3")
                        .attr("id","selection_rect");
                    buttons.select("#lbl_same").style("font-weight","normal");
                    buttons.select("#lbl_diff").style("font-weight","bold");

                } else {
                    buttons.select("#selection_rect").remove();
                    buttons.append("rect")
                        .attr("x",195)
                        .attr("y",60)
                        .attr("width",50)
                        .attr("height",25)
                        .style("fill","none")
                        .style("stroke","#33CE45")
                        .style("stroke-width","3")
                        .attr("id","selection_rect");
                    buttons.select("#lbl_same").style("font-weight","bold");
                    buttons.select("#lbl_diff").style("font-weight","normal");

                }
            });
    }
}


// draw choice panel
// mode: 1=default 2=introduce
function alt_choices(svg,lBound,mode) {
    var options = ["Highly Likely Different",
        "Moderately Likely Different",
        "Less Likely Different",
        "Less Likely Same",
        "Moderately Likely Same",
        "Highly Likely Same"];
    var x = [60, 180, 300, 420, 540, 660];
    var lx = [30, 60, 96, 180, 216, 300, 336, 420, 456, 540, 576, 660, 696, 750];
    var y = 140;
    // add buttons
    var buttons = svg.append("g").attr("transform", "translate(" + lBound + ",0)");
    //buttons.append("rect").attr("x",-10*scale).attr("y",0).attr("width",280*scale).attr("height",85*scale).style("fill","#68a7ca").style("opacity",1);
    if(mode!=2){
        buttons.append("text").attr("x", 660).attr("y", 220).text("Same").attr("text-anchor", "middle").style("font", 36 + "px sans-serif");
        buttons.append("text").attr("x", 150).attr("y", 220).text("Different").attr("text-anchor", "middle").style("font", 36 + "px sans-serif");
    }
    for (var p = 0; p < options.length; p++) {
        buttons.append("text").attr("id","labelText"+p.toString())
            .attr("x", x[p] + 18).attr("y", function(){if(mode==2 && p%2==1){return 180;}return 110;})
            .text(function(){if(mode==2){return options[p];}return options[p][0];})
            .attr("text-anchor", "middle").style("font", function(){if(mode==2){return 14+"px sans-serif";}return 40 + "px sans-serif";});
    }
    //arrows
    for(var pos=0;pos<7;pos++){
        var lineData = [{"x": lx[2*pos], "y": y}, {"x": lx[2*pos+1], "y": y}];
        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("linear");
        buttons.append("path").attr("d", lineFunction(lineData))
            .attr("stroke", "black")
            .attr("stroke-width", 5)
            .style("fill","none");
    }
    var xScale = d3.scale.linear();
    var yScale = d3.scale.linear();
    var leftTrianglePoints = xScale(0) + ' ' + yScale(140) + ', ' + xScale(30) + ' ' + yScale(122) +
        ', ' + xScale(30) + ' ' + yScale(158) + ' ' + xScale(30) + ', ' + yScale(158) + ' ' +
        xScale(0) + ' ' + yScale(140);
    var rightTrianglePoints = xScale(780) + ' ' + yScale(140) + ', ' + xScale(750) + ' ' +
        yScale(122) + ', ' + xScale(750) + ' ' + yScale(158) + ' ' + xScale(750) + ', ' +
        yScale(158) + ' ' + xScale(780) + ' ' + yScale(140);
    buttons.append('polyline')
        .attr('points', leftTrianglePoints).attr("stroke","none").style('fill', 'black');
    buttons.append('polyline')
        .attr('points', rightTrianglePoints).attr("stroke","none").style('fill', 'black');

    for(var m=0;m<6;m++){
        var radioButton = buttons.append("g").attr("transform","translate("+x[m]+","+y+")");
        radioButton.append("svg:image").attr("xlink:href","/resources/0.png").attr("class","choice").attr("id",m)
            .attr("x",0).attr("y",-16).attr("width",36).attr("height",36);
        radioButton.on({"mouseover": function(d) {d3.select(this).style("cursor", "pointer")},
            "mouseout": function(d) {d3.select(this).style("cursor", "default")}})
            .on("click",function(d){
                buttons.select(".no").attr("opacity",0.2);
                buttons.selectAll(".choice").attr("xlink:href","/resources/0.png");
                d3.select(this).select("image").attr("xlink:href","/resources/1.png");
                var t = Date.now();
                experimentr.data()[clk].push([
                    t,
                    //svg.attr("id").slice(1),
                    d3.select(this.parentNode.parentNode).select("#c10").text(),
                    d3.select(this).select(".choice").attr("id")
                ]);
                // window.alert(d3.select(this).select(".choice").attr("id"));
                var choice = parseInt(d3.select(this).select(".choice").attr("id"));
                if(choice<3){
                    console.log("here");
                    buttons.select("#selection_rect").remove();
                    buttons.append("rect")
                        .attr("x",13)
                        .attr("y",60)
                        .attr("width",75)
                        .attr("height",25)
                        .style("fill","none")
                        .style("stroke","#CC1100")
                        .style("stroke-width","3")
                        .attr("id","selection_rect");
                    buttons.select("#lbl_same").style("font-weight","normal");
                    buttons.select("#lbl_diff").style("font-weight","bold");

                } else {
                    buttons.select("#selection_rect").remove();
                    buttons.append("rect")
                        .attr("x",195)
                        .attr("y",60)
                        .attr("width",50)
                        .attr("height",25)
                        .style("fill","none")
                        .style("stroke","#33CE45")
                        .style("stroke-width","3")
                        .attr("id","selection_rect");
                    buttons.select("#lbl_same").style("font-weight","bold");
                    buttons.select("#lbl_diff").style("font-weight","normal");

                }
            });
    }
}

function parsing(route, dest){
    d3.text(route, function (csvdata) {
        var groups = {};
        var parsedCSV = d3.csv.parseRows(csvdata);
        for (var j = 1; j < parsedCSV.length; j++) {
            if (!(parsedCSV[j][0] in groups)) {
                groups[parsedCSV[j][0]] = [parsedCSV[j]];
            } else {
                groups[parsedCSV[j][0]] = groups[parsedCSV[j][0]].concat([parsedCSV[j]]);
            }
        }
        var values = Object.keys(groups).map(function (key) {
            return groups[key];
        });
        var raw_binary = values.filter(function (d) {
            return d.length == 2;
        });
        if(experimentr.data()['section']=='mat'){
            n_pair = raw_binary.length;
        }
        if(experimentr.data()['section']=='section2'){
            s2_n_pair = raw_binary.length;
        }
        var binary = [];
        var other = [];
        var tmp = [];
        //console.log(raw_binary.length);
        for (var i = 0; i < raw_binary.length; i++) {
            if (tmp.length == 6) {
                if(tmp.length<6){
                    tmp.push(raw_binary[i]);
                }
                binary.push(tmp);
                tmp = [raw_binary[i]];
            } else {
                tmp.push(raw_binary[i]);
            }
            //console.log(raw_binary[i]);
        }
        //console.log(tmp);
        if (tmp != []) {
            binary.push(tmp);
        }
        binary.push([]);
        tmp = values.filter(function (d) {
            return d.length == 4;
        });
        for (var i = 0; i < tmp.length; i++) {
            var t = [];
            for (var j = 0; j < tmp[i].length / 2; j++) {
                t.push([tmp[i][2 * j], tmp[i][2 * j + 1]]);
            }
            other.push(t);
        }
        tmp = values.filter(function (d) {
            return d.length == 6;
        });
        for (var i = 0; i < tmp.length; i++) {
            var t = [];
            for (var j = 0; j < tmp[i].length / 2; j++) {
                t.push([tmp[i][2 * j], tmp[i][2 * j + 1]]);
            }
            other.push(t);
        }
        data[dest] = binary.concat(other);
        // answer keys

        var answer = [];
        for(var i=0;i<raw_binary.length;i++){
            answer.push(raw_binary[i][0][raw_binary[i][0].length-1]);
        }
        data[dest+'_answer'] = answer;
        experimentr.addData(data);
    });
}

// main study grading
function grading(){
    //init
    var grades = [],
        answers = {};
    for(var i=0;i<n_pair;i++){
        grades.push(0);
    }
    //retrieve answers
    for(var k in experimentr.data()['clicks']){
        answers[+experimentr.data()['clicks'][k][1]-1] = +experimentr.data()['clicks'][k][2];
    }
    //console.log(answers);
    for(var i in Object.keys(answers)){
        if(+answers[i]>2 && experimentr.data()['mat_answer'][+i]==1){
            grades[+i] = 1;
        }
        else if(+answers[i]<3 && experimentr.data()['mat_answer'][+i]==0){
            grades[+i] = 1;
        }
        else{
            grades[+i] = 0;
        }
    }
    var total = Object.values(grades).reduce((a, b) => a + b, 0);
    data['grades'] = grades;
    data['total_score'] = total;
    experimentr.addData(data);
}

// section2 grading
function grading2(){
    //init
    var grades = [],
        answers = {};
    for(var i=0;i<s2_n_pair;i++){
        grades.push(0);
    }
    //retrieve answers
    for(var k in experimentr.data()['s2_clicks']){
        answers[+experimentr.data()['s2_clicks'][k][1]-1] = +experimentr.data()['s2_clicks'][k][2];
    }
    for(var i in Object.keys(answers)){
        if(+answers[i]>2 && experimentr.data()['section2_answer'][+i]==1){
            grades[+i] = 1;
        }
        else if(+answers[i]<3 && experimentr.data()['section2_answer'][+i]==0){
            grades[+i] = 1;
        }
        else{
            grades[+i] = 0;
        }
    }
    var total = Object.values(grades).reduce((a, b) => a + b, 0);
    data['s2_grades'] = grades;
    data['s2_total_score'] = total;
    experimentr.addData(data);
}

/*
 Parsing for practice part
 */
function parsing2(route, dest){
    d3.text(route, function (csvdata) {
        var groups = {};
        var parsedCSV = d3.csv.parseRows(csvdata);
        for (var j = 1; j < parsedCSV.length; j++) {
            if (!(parsedCSV[j][0] in groups)) {
                groups[parsedCSV[j][0]] = [parsedCSV[j]];
            } else {
                groups[parsedCSV[j][0]] = groups[parsedCSV[j][0]].concat([parsedCSV[j]]);
            }
        }
        var values = Object.keys(groups).map(function (key) {
            return groups[key];
        });
        var raw_binary = values.filter(function (d) {
            return d.length == 2;
        });
        if(experimentr.data()['section']=='mat'){
            n_pair = raw_binary.length;
        }
        if(experimentr.data()['section']=='section2'){
            s2_n_pair = raw_binary.length;
        }
        var binary = [];
        var other = [];
        var new_group = {};

        for (var i = 0; i < raw_binary.length; i++) {
            var indice = raw_binary[i][0][raw_binary[i][0].length-2];
            if(!(indice in new_group)){
                new_group[indice] = [raw_binary[i]];
            }else{
                new_group[indice] = new_group[indice].concat([raw_binary[i]]);
            }
        }
        var keys = Object.keys(new_group);

        for(var key in keys){
            //console.log(key+1,new_group[+key+1]);
            binary = binary.concat([new_group[+key+1]]);
        }
        binary.push([]);
        data[dest] = binary.concat(other);
        // answer keys

        var answer = [];
        for(var i=0;i<raw_binary.length;i++){
            answer.push(raw_binary[i][0][raw_binary[i][0].length-1]);
        }
        data[dest+'_answer'] = answer;
        experimentr.addData(data);
    });
}

function parse_url() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}

/*
 Measure amount of disclosure
 */
function statictics(){
    var d = experimentr.data()['mat'];
    // console.log(d);
}


