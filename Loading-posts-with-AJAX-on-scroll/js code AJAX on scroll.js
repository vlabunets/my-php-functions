// js Ajax scroll post
jQuery(document).ready(function () {
    ajaxScroll();
    ajaxScrollSearch();
 });
jQuery(window).scroll(function () {
   ajaxScroll();
   ajaxScrollSearch();
 });

function ajaxScroll() {
    if(!jQuery('body').hasClass('search')) {
         if (jQuery(window).scrollTop() >= (jQuery("#page").height() - jQuery(window).height()-50)){
          if (!jQuery('body').hasClass("inprogres")) {
            jQuery('body').addClass("inprogres");
            if(!jQuery('body').hasClass("open")){
              jQuery('.load-panel').show();
            }
            if(jQuery("body").hasClass("category")){
              var id = jQuery(".cat-id").text();
			  
            } else{
              var id = 0;
            }
            var count = jQuery(".posts li.listing").size();
            var totalPost = jQuery('.total-posts').text();
            console.log(count+ "." + totalPost);
            
                var xhr = jQuery.ajax({
                  type: "POST",
                  url: jQuery('.base-url').text() + "wp-admin/admin-ajax.php",
                  data: "action=get_scroll&id=" + id + "&count=" + count,
                  success: function (html) {
                      stButtons.locateElements();
                      
                    if (count == totalPost){
                        
                        jQuery('.load-panel').hide();
                        jQuery('body').removeClass("inprogres");
                        jQuery('body').addClass("open");
						xhr.abort();
                        
                    }else {

                        jQuery(".posts").append(html);
                        stButtons.locateElements();
                        setTimeout(function(){
                            //jQuery(".load-post").css('transform','scale(1)');
                            jQuery('body').removeClass("inprogres");
                            jQuery('.load-panel').hide();
                            
                        },300);
                      }
					 loadAds(count); 
                  }
                });
              }
            
          
        }
    }
}
