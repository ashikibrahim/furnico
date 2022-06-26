function firstlogedin() {
    Swal.fire({
        title: 'PLease login first!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    }).then((result) => {
        location.href = '/login'

    })
}
function addCart() {
    Swal.fire({
        title: 'Product added to cart!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    }).then((result) => {

    })
}
function add_to_cart(proId){
    alert("single product")
    $.ajax({
        url:'/add-tocart/'+proId,
        method:'get',   
        success:(response)=>{
            if(response.msg){   
                addCart()             
                let count=$('#cart-count').html()
                counts=parseInt(count)+1
                $('#cart-count').html(counts)
            }else{
                firstlogedin()
            }            
        }
    })
}