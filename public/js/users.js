/***
 * VTrack
 */

 function selectImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.ava-profile')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function detailUser(userId) {
    // $('#form-user')[0].reset();
    $('#modal-user').modal('show');
    $('.modal-user-title').text('Chi tiết');

    $.ajax({
        url: baseUrl + "/api/user/get-infor?userId=" + userId,
        type: "GET",
        data: "",
        dataType: "JSON",
        success: function(data) {
            $('.user-id').val(data.user_id);
            $('.email').val(data.email);
            $('.display-name').val(data.display_name);
            $('.user-phone').val(data.phone);
            $('.user-description').val(data.description);
            $('.ava-profile').attr("src", baseUrl + data.url_image);
        },
    });
}

function updateUser() {
    // Get form
    var form = $('#form-user')[0];

    // Create an FormData object 
    var data = new FormData(form);

    $.ajax({
        url: baseUrl + "/api/user/add-user",
        type: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        data: data,
        dataType: "JSON",
        success: function(data) {
            console.log(data);
            alert("Cập nhật thành công");
            $('#modal-user').modal('hide');
            location.reload();
        },
    });
}

function deleteUser(userId, url_image) {
    
    $('#deleteModal').modal('show');

    $('#btn-delete').on('click', function() {
        $.ajax({
            url: baseUrl + "/api/user/disable",
            type: "PUT",
            data: {
                user_id: userId,
                url_image: url_image
            },
            dataType: "JSON",
            success: function (data) {
                console.log(data);
                $('#deleteModal').modal('hide');
                alert('Xóa thành công');
                location.reload();
            },
        });
    })

    

}

function openModalAdd() {
    $('#modal-user-add').modal('show');

    var form = $('#form-user-add')[0];
    form.reset();
}

function addAccount() {
    // Get form
    var form = $('#form-user-add')[0];

    // Create an FormData object 
    var data = new FormData(form);

    $.ajax({
        url: baseUrl + "/api/user/register",
        type: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        data: data,
        dataType: "JSON",
        success: function(data) {
            console.log(data);    
            if (data.status == 201) {
                alert("Thêm thành công");
                $('#modal-user-add').modal('hide');
                location.reload();
            } else {
                alert("Không thành công")
            }
        },
    });

}

