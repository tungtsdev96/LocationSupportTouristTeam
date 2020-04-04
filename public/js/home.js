$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    showModal();
});


function showModal() {
    $('body').on('click', ".row-map .map-element", function () {
        if ($(this).hasClass("tree")) {
            console.log("tree");
            $('#modal-edit-tree').modal('show');
            $('.modal-edit-tree-title').text('Thông tin chi tiết của cây');
            $('[name="tree_id"]').val($(this).attr("data-id"));
            $('[name="tree_name"]').val($(this).attr("data-name"));
            $('[name="x"]').val($(this).attr("data-x"));
            $('[name="y"]').val($(this).attr("data-y"));
            $('[name="current_water"]').val($(this).attr("data-water"));
            $(".modal-current-state").val($(this).attr("data-current-state"));
            $(".modal-tree-state").val($(this).attr("data-tree-state"));
            $(".tree-type").val($(this).attr("data-tree-type"));

            //Gán data là vị trí x, y ban đầu của cây cho button save, để khi update vị trí xong
            //có thể có data x, y cũ để update vị trí đó trên map thành vị trí trống

            $(".modal-save-tree").attr("data-old-x", $(this).attr("data-x"));
            $(".modal-save-tree").attr("data-old-y", $(this).attr("data-y"));


            //Gán link cho button thống kê, và lịch sử tưới
            var linkDetail = baseUrl + "/histories-water-by-tree?tree_id=" + $(this).attr("data-id");
            var linkStatistical = baseUrl + "/sensor-data?tree_id=" + $(this).attr("data-id");
            $(".history-water").attr("href", linkDetail);
            $(".statistical-water").attr("href", linkStatistical);

            //Bắt sự kiện edit tree, cho phép sửa các input
            $('body').on('click', ".modal-edit-tree", function () {
                $(this).parents(".modal-content").find(".tree-name").attr("readonly", false);
                $(this).parents(".modal-content").find(".x").attr("readonly", false);
                $(this).parents(".modal-content").find(".y").attr("readonly", false);
                $(this).parents(".modal-content").find(".current_water").attr("readonly", false);
                $(this).parents(".modal-content").find(".modal-current-state").attr("readonly", false);
                $(this).parents(".modal-content").find(".modal-tree-state").attr("readonly", false);
                $(this).parents(".modal-content").find(".tree-type").attr("readonly", false);
                $(this).parents(".modal-footer").find(".modal-save-tree").attr("disabled", false);

                //Bắt sự kiện click save sau khi edit các trường thông tin của tree
                $('body').on('click', ".modal-save-tree", function () {
                    var validateName = $('[name="tree_name"]').val();
                    var validateTreeX = $('[name="x"]').val();
                    var validateTreeY = $('[name="y"]').val();
                    var validateCurrentWater = $('[name="current_water"]').val();

                    if (validateName == "" || validateTreeX == "" || validateTreeY == "" || validateCurrentWater == "") {
                        alert("Vui lòng điền đủ thông tin");
                    } else if (validateTreeX > 50 || validateTreeX < 0 || validateTreeY > 50 || validateTreeY < 0) {
                        alert("Tọa độ x,y phải lớp hơn hoặc bằng 0 và nhỏ hơn hoặc bằng 50");
                    } else {
                        console.log("Data oke");
                        var x = $('[name="x"]').val();
                        var y = $('[name="y"]').val();
                        var oldX = $(".modal-save-tree").attr("data-old-x");
                        var oldY = $(".modal-save-tree").attr("data-old-y");
                        if (x != oldX || y != oldY) {
                            $.ajax({
                                url: baseUrl + "/api/map/check_invalid_location/" + x + "/" + y,
                                type: "GET",
                                dataType: "JSON",
                                success: function (data) {
                                    // console.log(data);
                                    if (data.value != 0) {
                                        alert("Vị trí đã tồn tại cây/trạm nước/vật cản, không thể thêm cây khác");
                                    } else {
                                        //Dùng ajax để update thông tin cây + update thông tin map
                                        $.ajax({
                                            url: baseUrl + "/api/tree/update",
                                            type: "PUT",
                                            data: $('#form-tree-edit').serialize(),
                                            dataType: "JSON",
                                            success: function (data) {
                                                if(!alert('Update thông tin cây thành công!')){
                                                    $('#modal-edit-tree').modal("hide");
                                                    window.location.reload();
                                                }
                                            },
                                        });
                                    }
                                },
                            });

                        } else {
                            $.ajax({
                                url: baseUrl + "/api/tree/update",
                                type: "PUT",
                                data: $('#form-tree-edit').serialize(),
                                dataType: "JSON",
                                success: function (data) {
                                    if(!alert('Update thông tin cây thành công!')){
                                        $('#modal-edit-tree').modal("hide");
                                        window.location.reload();
                                    }
                                },
                            });
                        }
                    }

                });
            });

        } else if ($(this).hasClass("water")) {
            $("#modal-edit-ws").modal("show");
            $('.modal-edit-ws-title').text('Thông tin chi tiết của trạm nước');
            $('[name="water_id"]').val($(this).attr("data-id"));
            $('[name="water_name"]').val($(this).attr("data-name"));
            $('[name="water_x"]').val($(this).attr("data-x"));
            $('[name="water_y"]').val($(this).attr("data-y"));
            $('[name="water_location"]').val($(this).attr("data-location"));
            $(".water-state").val($(this).attr("data-state"));

            //Vi tri cu cua tram nuoc
            $(".modal-save-water").attr("data-old-x", $(this).attr("data-x"));
            $(".modal-save-water").attr("data-old-y", $(this).attr("data-y"));

            $('body').on('click', ".modal-save-water", function () {
                var validateWaterName = $('[name="water_name"]').val();
                var validateWaterX = $('[name="water_x"]').val();
                var validateWaterY = $('[name="water_y"]').val();
                var validateWaterLocation = $('[name="water_location"]').val();
                if (validateWaterName == "" || validateWaterX == "" || validateWaterY == "" || validateWaterLocation == "") {
                    alert("Vui lòng điền đủ thông tin");
                } else if (validateWaterX > 50 || validateWaterX < 0 || validateWaterY > 50 || validateWaterY < 0) {
                    alert("Tọa độ x,y phải lớp hơn hoặc bằng 0 và nhỏ hơn hoặc bằng 50");
                } else {
                    var x = $('[name="water_x"]').val();
                    var y = $('[name="water_y"]').val();
                    var oldX = $(".modal-save-water").attr("data-old-x");
                    var oldY = $(".modal-save-water").attr("data-old-y");
                    if (x != oldX || y != oldY) {
                        $.ajax({
                            url: baseUrl + "/api/map/check_invalid_location/" + x + "/" + y,
                            type: "GET",
                            dataType: "JSON",
                            success: function (data) {
                                if (data.value != 0) {
                                    alert("Vị trí đã tồn tại cây/trạm nước/vật cản, không thể thêm trạm nước khác");
                                } else {
                                    $.ajax({
                                        url: baseUrl + "/api/water-station/update",
                                        type: "PUT",
                                        data: $('#form-ws-edit').serialize(),
                                        dataType: "JSON",
                                        success: function (data) {
                                            // if(!alert('Update thông tin trạm nước thành công!')){
                                            //     console.log("Jun");
                                            //     $('#modal-edit-ws').modal("hide");
                                            //     window.location.reload();
                                            // }
                                        },
                                    });
                                    alert('Update thông tin trạm nước thành công!');
                                    $('#modal-edit-ws').modal("hide");
                                    window.location.reload();
                                }
                            }
                        });

                    } else {
                        $.ajax({
                            url: baseUrl + "/api/water-station/update",
                            type: "PUT",
                            data: $('#form-ws-edit').serialize(),
                            dataType: "JSON",
                            success: function (data) {
                                if(!alert('Update thông tin trạm nước thành công!')){
                                    $('#modal-edit-ws').modal("hide");
                                    window.location.reload();
                                }
                            }
                        });
                        alert('Update thông tin trạm nước thành công!');
                        $('#modal-edit-ws').modal("hide");
                        window.location.reload();
                    }
                }
            });
        } else if ($(this).hasClass("nothing")) {
            var xAdd = $(this).attr('data-x');
            var yAdd = $(this).attr('data-y');
            console.log("nothing");
            $('#modal-choose').modal("show");
            //Thêm cây mới
            $('body').on('click', ".add-tree", function () {
                $('#modal-choose').modal("hide");
                setTimeout(function () {
                    $('#modal-edit-tree').modal("show");
                }, 500);
                $('.modal-edit-tree-title').text('Thêm mới cây');

                $('[name="x"]').val(xAdd);
                $('[name="y"]').val(yAdd);

                $('.history-water').attr("disabled", true);
                $('.statistical-water').attr("disabled", true);

                //Edit to add tree
                $('body').on('click', ".modal-edit-tree", function () {
                    $(this).parents(".modal-content").find(".tree-name").attr("readonly", false);
                    $(this).parents(".modal-content").find(".current_water").attr("readonly", false);
                    $(this).parents(".modal-content").find(".modal-current-state").attr("readonly", false);
                    $(this).parents(".modal-content").find(".modal-tree-state").attr("readonly", false);
                    $(this).parents(".modal-content").find(".tree-type").attr("readonly", false);
                    $(this).parents(".modal-footer").find(".modal-save-tree").attr("disabled", false);

                    $('body').on('click', ".modal-save-tree", function () {
                        console.log("save add tree");
                        var validateName = $('[name="tree_name"]').val();
                        var validateCurrentWater = $('[name="current_water"]').val();

                        if (validateName == "" || validateCurrentWater == "") {
                            alert("Vui lòng điền đủ thông tin");
                        } else {
                            $.ajax({
                                url: baseUrl + "/api/tree/create",
                                type: "POST",
                                data: $('#form-tree-edit').serialize(),
                                dataType: "JSON",
                                success: function (data) {
                                    $.ajax({
                                        url: baseUrl + "/api/map/update",
                                        type: "PUT",
                                        data: { "x": xAdd, "y": yAdd, "value": 1 },
                                        dataType: "JSON",
                                        success: function (data) {
                                            
                                        },
                                    });
                                    alert('Thêm mới cây thành công!');
                                    $('#modal-edit-water').modal("hide");
                                    window.location.reload();
                                },
                            });
                        }
                    });
                });
            });


            // Edit to add Water station
            $('body').on('click', ".add-water", function () {
                console.log("Add water station");
                $('#modal-choose').modal("hide");
                setTimeout(function () {
                    $('#modal-edit-ws').modal("show");
                }, 500);
                $('.modal-edit-ws-title').text('Thêm mới trạm nước');
                $('[name="water_x"]').val(xAdd);
                $('[name="water_y"]').val(yAdd);
                $('[name="water_x"]').attr("readonly", true);
                $('[name="water_y"]').attr("readonly", true);
                $('[name="water_state"]').attr("readonly", true);

                $('body').on('click', ".modal-save-water", function () {
                    console.log("save add water station");
                    var validateName = $('[name="water_name"]').val();
                    var validateLocation = $('[name="water_location"]').val();
                    if (validateName == "" || validateLocation == "") {
                        alert("Vui lòng điền đầy đủ thông tin trạm nước");
                    } else {
                        $.ajax({
                            url: baseUrl + "/api/water-station/create",
                            type: "POST",
                            data: $('#form-ws-edit').serialize(),
                            dataType: "JSON",
                            success: function (data) {
                                $.ajax({
                                    url: baseUrl + "/api/map/update",
                                    type: "PUT",
                                    data: { "x": xAdd, "y": yAdd, "value": 4 },
                                    dataType: "JSON",
                                    success: function (data) {
                                        
                                    },
                                });
                                !alert('Thêm mới trạm nước thành công!')
                                $('#modal-edit-ws').modal("hide");
                                window.location.reload();
                            },
                        });
                    }
                });
            })
        } else {
            console.log("rock");
        }
    });
}
