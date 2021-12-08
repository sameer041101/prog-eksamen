function items(val) {
    fetch("/varer")
    .then(response => {
    return response.json();
    })
    .then(data => {
        var x = document.getElementById("kat").value;
        var html = ""
        for (var key in data){
            if(val == "val" && x != "alle"){
                if(data[key]["varer"]["kat"].toLowerCase() == x.toLowerCase()){
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
                        </div>
                        
                    </div>
                    `
                }
            }else{
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
                    </div>
                    
                </div>
                `
            }
        }

        document.getElementById("items").innerHTML = html
    });
}

function kat() {
    fetch("/varer")
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data[0]["varer"])
        var kat = []
        var html = `
                <option value="alle">Alle</option>
            `

            
            
        
        for (var key in data){
            kat.push(data[key]["varer"]["kat"].toLowerCase())
        }
        var katagorier = new Set(kat);
        katagorier = Array.from(katagorier);
        for (var key in katagorier){
            var k = katagorier[key];
            var k = k.charAt(0).toUpperCase() + k.slice(1);
            html += `<option value="${k}">${k}</option>`
        }

        document.getElementById("kat").innerHTML = html
    });
}