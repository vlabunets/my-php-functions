/* Wc add to cart version 1.2.6 */
jQuery(function ($) {

    // wc_add_to_cart_params is required to continue, ensure the object exists
    if (typeof wc_add_to_cart_params === 'undefined')
        return false;

    // Ajax add to cart
    $(document).on('click', '.single_add_to_cart_button', function (e) {

        //console.log('plugin ajax add to cart');
        var is_$single_form = false, 
            is_$variation_form = false;
        
        if($(this).closest('form.cart').length == 1){
            is_$single_form = true;
        }
        if($(this).closest('.variations_form').length == 1){
            is_$variation_form = true;
        }
        
        $single_form = $(this).closest('form.cart');
        $variation_form = $(this).closest('.variations_form'); 
        //console.dir(is_$single_form , is_$variation_form);
        
        if(is_$variation_form){
            var var_id = $variation_form.find('input[name=variation_id]').val(),
            product_id = $variation_form.find('input[name=product_id]').val(),
            quantity = $variation_form.find('input[name=quantity]').val(),
            $errorInfo = $variation_form.find('.woocommerce-error');
            
            //attributes = [];
            $('.ajaxerrors').remove();
            
            var item = {},
                check = true;
                
            variations = $variation_form.find('select[name^=attribute]');
            /* Updated code to work with radio button - mantish - WC Variations Radio Buttons - 8manos */
            if (!variations.length) {
                variations = $variation_form.find('[name^=attribute]:checked');
            }
            /* Backup Code for getting input variable */
            if (!variations.length) {
                variations = $variation_form.find('input[name^=attribute]');
            }
            variations.each(function () {
                var $this = $(this),
                        attributeName = $this.attr('name'),
                        attributevalue = $this.val(),
                        index,
                        attributeTaxName;
                $this.removeClass('error');
                if (attributevalue.length === 0) {
                    index = attributeName.lastIndexOf('_');
                    attributeTaxName = attributeName.substring(index + 1);
                    $this
                            //.css( 'border', '1px solid red' )
                            .addClass('required error')
                            //.addClass( 'barizi-class' )
                            .before('<div class="ajaxerrors"><p>Please select ' + attributeTaxName + '</p></div>')

                    check = false;
                } else {
                    item[attributeName] = attributevalue;
                }

                // Easy to add some specific code for select but doesn't seem to be needed
                // if ( $this.is( 'select' ) ) {
                // } else {
                // }

            });
            if (!check) {
                return false;
            }
            //item = JSON.stringify(item);
            //alert(item);
            //return false;
            // AJAX add to cart request

            var $thisbutton = $(this);
            if ($thisbutton.is('.single_add_to_cart_button')) {

                $thisbutton.removeClass('added');
                $thisbutton.addClass('loading');

                var data = {
                    action: 'woocommerce_add_to_cart_variable_rc',
                    product_id: product_id,
                    quantity: quantity,
                    variation_id: var_id,
                    variation: item
                };
                
                
                // Trigger event
                $('body').trigger('adding_to_cart', [$thisbutton, data]);

                // Ajax action
                $.post(wc_add_to_cart_params.ajax_url, data, function (response) {
                    //console.dir(response);
                    // add cart
                    if (jQuery('#header .cart').find('.cart-contents').length == 0) {
                        $('#header .cart').append('<a class="cart-contents" href=""><span></span></a>');
                    }
                    if (!response)
                        return;

                    var this_page = window.location.toString();

                    this_page = this_page.replace('add-to-cart', 'added-to-cart');

                    if (response.error && response.product_url) {
                        var notice = response.notice;
                        console.log(response);
                        //window.location = response.product_url;
                        jQuery('.single_variation_wrap').addClass('not-checked');
                        $('form.cart').after('<ul class="woocommerce-error ajaxerrors"><li>' + notice + '</li></ul>');
                        
                        return false;
                    }

                    $thisbutton.removeClass('loading');

                    var fragments = response.fragments;
                    var cart_hash = response.cart_hash;

                    // Block fragments class
                    if (fragments) {
                        $.each(fragments, function (key) {
                            $(key).addClass('updating');
                        });
                    }

                    // Block widgets and fragments
                    $('.shop_table.cart, .updating, .cart_totals').fadeTo('400', '0.6').block({
                        message: null,
                        overlayCSS: {
                            opacity: 0.6
                        }
                    });

                    // Changes button classes
                    //$thisbutton.addClass( 'added' );

                    // View cart text
    //				if ( ! wc_add_to_cart_params.is_cart && $thisbutton.parent().find( '.added_to_cart' ).size() === 0 ) {
    //					$thisbutton.after( ' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' + wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>' );
    //				}			

                    // Replace fragments
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    }

                    // Unblock
                    $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();

                    // Cart page elements
                    $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function () {

                        $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                        $(document.body).trigger('cart_page_refreshed');
                    });

                    $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function () {
                        $('.cart_totals').stop(true).css('opacity', '1').unblock();
                    });

                    // Trigger event so themes can refresh other areas
                    $(document.body).trigger('added_to_cart', [fragments, cart_hash, $thisbutton]);
                });

                return false;

            } else {
                return true;
            }
        } else if (is_$single_form) {

            $("form.cart").on("change", "input.qty", function () {
                $(this.form).find("button[data-quantity]").data("quantity", this.value);
            });
            
            var product_id = $single_form.find('input[name=add-to-cart]').val(),
                quantity = $single_form.find('input[name=quantity]').val();

            $('.ajaxerrors').remove();
            
            // AJAX add to cart request

            var $thisbutton = $(this);
            if ($thisbutton.is('.single_add_to_cart_button')) {

                $thisbutton.removeClass('added');
                $thisbutton.addClass('loading');

                var data = {
                    action: 'woocommerce_add_to_cart_variable_rc',
                    product_id: product_id,
                };

                // Trigger event
                $('body').trigger('adding_to_cart', [$thisbutton, data]);

                // Ajax action
                $.post(wc_add_to_cart_params.ajax_url, data, function (response) {
                    //console.dir(response);
                    // add cart
                    if (jQuery('#header .cart').find('.cart-contents').length == 0) {
                        $('#header .cart').append('<a class="cart-contents" href=""><span></span></a>');
                    }
                    if (!response)
                        return;

                    var this_page = window.location.toString();

                    this_page = this_page.replace('add-to-cart', 'added-to-cart');

                    if (response.error && response.product_url) {
                        var notice = response.notice;
                        $('form.cart').find('button[type=submit]').hide();
                        $('form.cart').after('<ul class="woocommerce-error ajaxerrors"><li>' + notice + '</li></ul>');
                        
                        return false;
                    }

                    $thisbutton.removeClass('loading');

                    var fragments = response.fragments;
                    var cart_hash = response.cart_hash;

                    // Block fragments class
                    if (fragments) {
                        $.each(fragments, function (key) {
                            $(key).addClass('updating');
                        });
                    }

                    // Block widgets and fragments
                    $('.shop_table.cart, .updating, .cart_totals').fadeTo('400', '0.6').block({
                        message: null,
                        overlayCSS: {
                            opacity: 0.6
                        }
                    });			

                    // Replace fragments
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    }

                    // Unblock
                    $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();

                    // Cart page elements
                    $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function () {

                        $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                        $(document.body).trigger('cart_page_refreshed');
                    });

                    $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function () {
                        $('.cart_totals').stop(true).css('opacity', '1').unblock();
                    });

                    // Trigger event so themes can refresh other areas
                    $(document.body).trigger('added_to_cart', [fragments, cart_hash, $thisbutton]);
                });

                return false;

            } else {
                return true;
            }

        }
    });
    
    /* remove notice */
    $('.helper').on('click', 'span', function(){
        $('form.cart').find('button[type=submit]').removeClass('loading');
        $('.ajaxerrors').remove();
    });
    
});
