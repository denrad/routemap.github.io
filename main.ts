 // <reference path ="node_modules/@types/jquery/JQuery.d.ts"/>

const daysPerYear = 365, // TODO добавить поддерку високосных годов
    round2 = function (value) {
      return Math.round(value * 100) / 100;
    };

const currency = new Intl.NumberFormat("ru", {
    "style": "currency",
    "currency": "RUB"
}),
    formatter = new Intl.NumberFormat("ru", {
       "useGrouping": true,
       "minimumFractionDigits": 2
    });

class Route {
    public busses: number;
    public hours: number;
    public kilometers: number;
    public flights: number;
    public c10 : number;
    public c11 : number;
    public c37 : number;
    public c17 : number;
    public c19 : number;
    public c21 : number;
    public result : number;

    constructor(busses: number, hours: number, kilometers: number, flights: number, c10 : number, c37 : number, c11 : number, c17 : number, c19 : number, c21 : number) {
        this.busses = busses;
        this.hours = hours;
        this.kilometers = kilometers;
        this.flights = flights;
        this.c10 = c10;
        this.c11 = c11;
        this.c37 = c37;
        this.c17 = c17;
        this.c19 = c19;
        this.c21 = c21;
  }

    calc() {
       let c = {};
       c[8] = this.busses * this.hours * daysPerYear;
       c[9] = this.kilometers * this.flights * daysPerYear;
       c[10] = this.c10;
       c[11] = this.c11;
       c[12] = 1.08;
       c[13] = 1.0;
       c[14] = 1.04;
       c[15] = 1744;
       c[16] = 1832;
       c[17] = this.c17;
       c[18] = 7.5;
       c[19] = this.c19;
       c[20] = c[17] / 100 * (1+0.01 * c[18]) + c[19] / (c[9] / c[8]) * 6/12;
       c[21] = this.c21;
       c[22] = 1.014;
       c[23] = 13.3;
       c[24] = 0.9;
       c[25] = 10.2;
       c[26] = 1.2;
       c[27] = 34.8;
       c[28] = 0.84;
       c[29] = 1.045;
       c[30] = 1.156;
       c[31] = 6.4;
       c[32] = 1.25;
       c[33] = 0.58;
       c[34] = 0.96;
       c[35] = 1.048;
       c[36] = this.busses;
       c[37] = this.c37;
       c[38] = 12;
       c[39] = 7;
       c[42] = round2(12 * 1.2 * this.c10 * c[13] * c[8] * c[12] * c[14] / (c[9] * c[15])); // =ОКРУГЛ(12*1,2*C10*C13*C8*C12*C14/(C9*C15);2)
       c[43] = round2(c[42] * c[27] / 100);
       c[44] = round2(c[21]*c[20]*c[22]); // =ОКРУГЛ(C21*C20*C22;2)
       c[45] = round2(c[44] * 0.075); // =ОКРУГЛ(C44*0,075;2)
       c[46] = round2(c[28] * c[30]); // =ОКРУГЛ(C28*C30;2)

       c[47] = round2(
           c[31] * c[32] * c[30] + 0.001 * 12 * 1.2 * c[14] * c[11] * c[13]
            * (c[23] / c[24] + c[25] * c[26]) / c[16] * (1 + 30.2/100)
        );

       c[48] = round2(c[33] * (c[44] + c[45] + c[46] + c[47])); // =ОКРУГЛ(C33*(C44+C45+C46+C47);2)
       c[40] = c[42]+c[43]+c[44]+c[45]+c[46]+c[47]+c[48];

       console.log(`c40 = ${c[42]} + ${c[43]} + ${c[44]} + ${c[45]} + ${c[46]} + ${c[47]} + ${c[48]}`)

       c[49] = c[40]*c[35]*c[9]/c[34] + c[36]* this.c37 *c[29]*c[38]/(12 * c[39]); // =(C40*C35*C9/C34)+C36*C37*C29*C38/(12*C39)
       c[50] = 0;
       this.result = c[51] = round2(c[49] + c[50]);

       return c;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const debugMode = (location.hash == '#debug');

    $('#calc').on('click', () => {

        let busses = ~~$('#busses').val(),
            hours = ~~$('#hours').val(),
            kilometers = ~~$('#kilometers').val(),
            flights_workdays = ~~$('#flights_workdays').val();

        const route = new Route(
            busses,
            hours,
            kilometers,
            flights_workdays,
            ~~$('#c10').val(),
            ~~$('#c37').val(),
            ~~$('#c11').val(),
            ~~$('#c17').val(),
            ~~$('#c19').val(),
            ~~$('#c21').val()
        );

        let result = route.calc();

       if (debugMode) {
           console.log(result);
       }

        $('#output').show();
        for (let key in result) {
            let value = result[key],
                $cell = $(`#td${key}`);

            if ($cell.hasClass('rouble')) {
                value = currency.format(value)
            } else {
                value = formatter.format(value);
            }
            $cell.text(value);
        }

        $('#c51').text(currency.format(result[51]));
    });

    if (debugMode) {
        $('th[scope=row]').each((i, el) => {
            let html = $(el).html();
            $(el).html(`${i + 8}. ${html}`);
        });
    }
});
