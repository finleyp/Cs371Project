$(document).ready(function () {
    console.log("ready");
    $(document).ready(function() {
     $('#bttnsubmit').attr('disabled','disabled');
     $('input[type="text"]').keyup(function() {
        if($(this).val() != '') {
           $('input[type="submit"]').removeAttr('disabled');
        }
     });
 });
});