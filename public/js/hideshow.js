$("#divtoggle").delegate("a", "click", function(e) {
    var toggled = ($(this).prop("id"));
    $("div#bs-example-navbar-collapse-1").prop("class", toggled);
});