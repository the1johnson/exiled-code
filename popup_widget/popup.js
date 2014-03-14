function ad_openPopup(event) {
    var jQuerytutPopup = jQuery("#liveUpdatesPopup");
    if (jQuerytutPopup.data("showing")) {
        return;
    }
    jQuerytutPopup.data("showing", true);

    var $window = jQuery(window);

    jQuerytutPopup.css({
        "top": (jQuery(window).height() - jQuerytutPopup.height()) / 2,
        "left": (jQuery(window).width() - jQuerytutPopup.width()) / 2
    });

    jQuery("#adv_tutPopupBg").css({
        "height": jQuery(window).height(),
        "opacity": "0.7"
    });

    jQuery("#adv_tutPopupBg, #liveUpdatesPopup").fadeIn(300);
}

function ad_closePopup(event) {
    if (!jQuery("#liveUpdatesPopup").data("showing")) {
        return;
    }
    jQuery("#liveUpdatesPopup").data("showing", false);
    jQuery("#adv_tutPopupBg, #liveUpdatesPopup").fadeOut("slow");
}

jQuery(function () {
    ad_openPopup();

    jQuery("#liveUpdatesPopupClose, #liveUpdatesGotit, #adv_tutPopupBg").click(ad_closePopup);

});