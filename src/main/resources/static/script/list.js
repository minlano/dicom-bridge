$(document).ready(function() {

    $("#search").click(function() {
        $.ajax({
            url: "/image-list",
            async: true,

        })


    })

})