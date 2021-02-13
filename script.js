const result = document.getElementById('result');
const upper = document.getElementById('upper');
const lower = document.getElementById('lower');
const number = document.getElementById('number');
const symbol = document.getElementById('symbol');
const generate = document.getElementById('generate');
const passwordLength = document.getElementById('length');
const clipboard = document.getElementById('clipboard');

function getRandomUpperChar(){
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomLowerChar(){
    return  String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomSymbol(){
    let symbol = "!#$%&()*-+/=<>?";
    return symbol[Math.floor(Math.random() * symbol.length)];
}

function getRandomNumber(){
   return Math.floor(Math.random() * 10);
}

const hash = {
    upper: getRandomUpperChar,
    lower: getRandomLowerChar,
    symbol: getRandomSymbol,
    number: getRandomNumber
};

async function generatePassword(checkedfunc, length){
    let password = '';
    let remainingIterations = length % (checkedfunc.length);
    let iterations = Math.floor(length/(checkedfunc.length));
    for (let i = 1; i <= iterations; i++){
        for await(let item of checkedfunc){
            if(remainingIterations > 0){
                remainingIterations--;
                let key = Object.keys(item)[0];
                password+= hash[key]();
            }
            let key = Object.keys(item)[0];
            password+= hash[key]();
        }
    }
    return  password;
}

generate.addEventListener('click', async ()=>{
    const checkedCount = upper.checked + lower.checked + number.checked + symbol.checked;
    const length = +passwordLength.value;
    if(length<8){
        alert('The password should be greater or equal to 8');
        result.innerHTML = '';
        return;
    }
    const checkedfunc = [{upper: upper.checked}, {lower: lower.checked}, {number: number.checked}, {symbol: symbol.checked}].filter((item)=>{
        return Object.values(item)[0];
    });
    if(checkedCount == 0){
        result.innerHTML = '';
        return;
    }
    else{
        result.innerHTML = await  generatePassword(checkedfunc, length);
    }
});

clipboard.addEventListener('click', ()=>{
    if(result.innerText){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.value = result.innerText;
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.getElementById('tooltip').innerText = `Copied: ${input.value}`;
        document.getElementById('tooltip').style.opacity = 1;
        document.body.removeChild(input);

        setTimeout(()=>{
            document.getElementById('tooltip').style.opacity = 0;
        },2000);
    }
});