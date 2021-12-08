function check_cookie_name(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        console.log(match[2]);
        return match[2]
    }
    else{
        console.log('--something went wrong---');
    }
}
user = () => {
    fetch("/userjson")
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data[0]["user"])
        var html = ""
        for (var key in data){
            if(data[key]["user"]["email"] == check_cookie_name("user")){
                html = `
                <div class="profile-header">
                    User information
                </div>
                <hr>
                <div class="profile-info">
                    <div class="profile-title">Email: </div>
                    <div class="profile-element"> ${data[key]["user"]["email"]}</div>
                    <div class="profile-edit"><a href="">Edit</a></div>
                </div>
                <hr>
                <div class="profile-info">
                    <div class="profile-title">Navn: </div>
                    <div class="profile-element">${data[key]["user"]["name"]}</div>
                    <div class="profile-edit"><a href="">Edit</a></div>
                </div>
                <hr>
                <div class="profile-info">
                    <div class="profile-title">Password: </div>
                    <div class="profile-element">****</div>
                    <div class="profile-edit"><a href="">Edit</a></div>
                </div>
                <hr>
                `
            }
        }

        document.getElementById("user-profile").innerHTML = html
    });
}