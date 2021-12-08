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
myitems = () => {
    fetch("/varer")
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data[0]["varer"])
        var html = ""
        for (var key in data){
            if(data[key]["varer"]["user"] == check_cookie_name("user")){
                html += `
                <div class="item">
                    <div class="item-img">

                    </div>
                    <div class="item-info">
                        <div class="item-kat">
                            Katagori: ${data[key]["varer"]["kat"]}
                        </div>
                        <div class="item-pris">
                            Pris: ${data[key]["varer"]["pris"]} kr
                        </div>
                    </div>
                    <div class="item-user-info">
                        <div class="item-owner">
                            ${data[key]["varer"]["user"]}
                        </div>
                        <div class="item-edit">
                            <a href=""> Edit </a>
                        </div>
                    </div>
                    
                </div>
                `
            }
        }

        document.getElementById("items").innerHTML = html
    });
}