/*
Baseado no tutorial desenvolvido por Lucas Jeleema no blog: https://technology.amis.nl/2017/02/09/nodejs-reading-and-processing-a-delimiter-separated-file-csv/
*/

var fs = require('fs');
var parse = require('csv-parse');

//Bibliotecas necessárias - sempre elas.

var inputFile='input.csv';
console.log("Processando o arquivo");

//essa função trata da separação das classes nas "Salas"

function trClass(clss){
    var vet1 = [];
    var vet2 = [];
    vet1 = clss.split('|');
    for(i=0;i<vet1.length;i++){
       if (vet1[i].indexOf("/") != 0 || vet[i].indexOf(",")!= 0){
            if(vet1[i].indexOf("/") != 0){
               vet2 += vet1[i].split("/");
               }
            else{
               vet2 += vet1[i].split(",");
            }
      }
      else{
        vet2+=vet1[i];
      }
    }
    for(i=0;i<vet2.length;i++){
        vet2[i] = vet2[i].concat(",","\n");
    }
    return vet2;
}
// função que trata os números de telefones
function phNum(telnum){
   const PNF = require('google-libphonenumber').PhoneNumberFormat;
   const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
   if(phoneUtil.isValidNumber(telnum)){
      var res = phoneUtil.format(telnum, PNF.INTERNATIONAL);
   }
   else{
      var res = "";
   }
   return res;
}

function checkEmail(email) {

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
        res = "";
    }
    else{
        res = email;
    }
    return res;
 }

var cont = 0; // flag de tratamento dos cabeçalhos e entradas de dados.
var tagresp = [];
var parser = parse({delimiter: ','}, function (err, data) {
    // Somente processa o arquivo após lido
    data.forEach(function(line) {
       // Aqui começo a tratar as strings para colocar no Json.
      //Começando pelos cabeçalhos...
      if (cont == 0){
              for (var i = 4; i<10;i++){
                  tagresp += line[i].split(' ');
                }
              cont++;
      }
      else{
      // montando a string json com os elementos dos vetores
       var banco = [{ "fullname" : line[0]
                    , "eid" : line[1]
                    , "classes:" : [trClass(line[2].concat("|",line[3]))]
                    , "addresses": [{
                         "type": "phone",
                         "tags": [
                            tagresp[6],
                            tagresp[7]
                         ],
                         "address": phNum(line[6])
                    }, {
                        "type": "email",
                        "tags": [
                            tagresp[9]
                        ],
                        "address": checkEmail(line[7])
                    }, {
                        "type": "email",
                        "tags": [
                            tagresp[11]
                        ],
                        "address": checkEmail(line[8])
                    }, {
                        "type": "email",
                        "tags": [
                            tagresp[1],
                            tagresp[2]
                        ],
                        "address": checkEmail(line[4])
                    }, {
                        "type": "phone",
                        "tags":[
                            tagresp[4]
                        ],
                        "address": phNum(line[5])

                    }, {
                        "type": "phone",
                        "tags": [
                            tagresp[6],
                            tagresp[7]
                        ],
                        "address": phNum(line[6])
                    }],
                    "invisible": line[10],
                    "see_all": line[11]
                    }]
       }
     console.log(JSON.stringify(banco));
    });
});

// na ordem inversa ele lê o csv e joga para o parser.
fs.createReadStream(inputFile).pipe(parser);
