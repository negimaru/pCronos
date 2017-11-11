$(document).ready(function() {
    var minutosExtra = 0;
    createContainers();
    createPanel();
    getDates(365, '365');

    var daysSinceLast21 = getDaysDifference(new Date, getLast21FromDate(new Date));
    var weekendDaysSinceLast21 = getWeekendDays(getLast21FromDate(new Date), new Date);
    var currentMonthDays = daysSinceLast21-weekendDaysSinceLast21;
    getDates(currentMonthDays, 'Mes Actual(desde el 21)');

    //showLicense();

    $(document).on('click', '#devuelveHoras', function() {
        var segundosDeMas = 0;
        var segundosDeMenos = 0;
        var diasQueHasTrabajadoDeMas = [];
        var diasQueHasTrabajadoDeMenos = [];
        var diaTrabajado = {};
        $('#myTable').find('tr').each(function() {
            if ($(this).hasClass('odd') || $(this).hasClass('even')) {
                var fecha = $(this).find('td:nth-child(2)').html()
                var entradaDia = timeToSecs($(this).find('td:nth-child(3)').html());
                var salidaDia = timeToSecs($(this).find('td:nth-child(4)').html());
                var tiempoDia = (salidaDia - entradaDia);
                var horasTotales = 0;
                //console.log('Horas Trabajadas el Dia : ' , fecha , ' : ' , formatSecondstoHours(tiempoDia) );
                if (tiempoDia > 28800) {
                    if( (tiempoDia - 28800)  >=  1800){
                        //console.log('Has Trabajado : ', formatSecondstoHours(tiempoDia-28800) ,' De Mas' );
                        //minutosExtra += (salidaDia - entradaDia) / 60;
                        segundosDeMas += tiempoDia - 28800;
                        diaTrabajado.fecha = fecha;
                        diaTrabajado.tiempoTrabajado = tiempoDia - 28800;
                        diasQueHasTrabajadoDeMas.push(diaTrabajado);
                    }
                }
                if (tiempoDia < 28800) {
                    segundosDeMenos += 28800 - tiempoDia;
                    diaTrabajado.fecha = fecha;
                    diaTrabajado.tiempoTrabajado = 28800 - tiempoDia;
                    diasQueHasTrabajadoDeMenos.push(diaTrabajado);
                    //console.log('RawTime : ' , ((28800-tiempoDia)));
                    //console.log('Has Trabajado : ', formatSecondstoHours((28800-tiempoDia)) ,' De Menos' );
                }
            }
        }).hide();
        window.scrollTo(0, 0);

        //console.log('Has Trabajado : ', formatSecondstoHours(segundosDeMas), ' De Mas');
        //console.log('Has Trabajado : ', formatSecondstoHours(segundosDeMenos), ' De Menos');
        //console.log('Tienes : ', formatSecondstoHours(segundosDeMas - segundosDeMenos), ' Horas');
        //console.log('Dias que has Trabajado de Mas : ', diasQueHasTrabajadoDeMas);
        //console.log('Dias que has Trabajado de Menos : ', diasQueHasTrabajadoDeMenos);
        horasTotales = segundosDeMas - segundosDeMenos;

        createTableHoras(horasTotales, segundosDeMas, segundosDeMenos);
        //createTableDias(diasQueHasTrabajadoDeMas, 'Dias De Mas', '.daysContainerMore');
        //createTableDias(diasQueHasTrabajadoDeMenos, 'Dias de Menos', '.daysContainerLess');
    });

    function timeToSecs(workTime) {
        var esplicedTime = workTime.split(":");
        var hours = parseInt(esplicedTime[0]);
        var minutes = parseInt(esplicedTime[1]);
        var secs = parseInt(esplicedTime[2]);

        var timeInSecs = (((hours * 60) + minutes) * 60) + secs;
        return timeInSecs;

    }

    function formatSecondstoHours(timeInSeconds) {
        var sec_num = parseInt(timeInSeconds, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    function createContainers() {
        $('.module-table-body').append('<div id="hoursCustomDiv">' +
            '<div class="hoursContainer" style="margin: 30px auto;"></div>' +
            '<div class="daysContainerMore" style="margin: 30px auto;"></div>' +
            '<div class="daysContainerLess" style="margin: 30px auto;"></div>' +
            '</div>');
    }

    function createPanel() {
        var estilosBoton = 'background: #349c5c; border: 0; border-top: 1px solid #6bd091; border-left: 1px solid #6bd091; border-right: 1px solid #349c5c; border-bottom: 1px solid #349c5c;color: #ffffff; font-size: 14px; padding: 2px 5px; margin: 0px 10px; cursor: pointer; max-width: 20%; text-align: center; border-radius: 5px; display:inline-block;';
        var html = '<label id="devuelveHoras" style="' + estilosBoton + '">Dame Mis Horas</label>';

        $('#pager > form > div').append(html);
    }

    function createTableHoras(horasTotales, segundosDeMas, segundosDeMenos) {
        var html = '<h2><span style="background: #d44e00; color: white; text-shadow: 0px 2px black;">Tabla de Horas</a></span></h2>';
        html += '<table>';
        html += '<tbody>';

        html += '<tr>';
        html += '<th class="header">Horas Totales: </th>';
        html += '<th class="header">Horas de Mas : </th>';
        html += '<th class="header">Horas de Menos : </th>';
        html += '</tr>';

        html += '<tr class="odd">';
        html += '<td class="odd">' + formatSecondstoHours(horasTotales) + '</td>';
        html += '<td class="odd">' + formatSecondstoHours(segundosDeMas) + '</td>';
        html += '<td class="odd">' + formatSecondstoHours(segundosDeMenos) + '</td>';
        html += '</tr>';

        html += '	</tbody>';
        html += '</table>';

        $('.hoursContainer').html(html);
    }

    function createTableDias(diasQueHasTrabajado, tituloTabla, selector) {
        var estilosTabla = '';
        if (selector == '.daysContainerMore') {
            estilosTabla = 'background: #1f7d00; color: white; text-shadow: 0px 2px black;'
        } else {
            estilosTabla = 'background: #7d0000; color: white; text-shadow: 0px 2px black;'
        }
        var html = '<h2><span style="' + estilosTabla + '">' + tituloTabla + '</a></span></h2>';
        html += '<table>';
        html += '<tbody>'
        html += '<tr>';
        html += '<th class="header">Fecha: </th>';
        html += '<th class="header">Tiempo : </th>';
        html += '</tr>';
        for (var index = 0; index != diasQueHasTrabajado.length; index++) {
            if (index % 2 == 1) {
                html += '<tr class="odd">';
            } else {
                html += '<tr class="even">';
            }
            html += '<td class="odd">' + diasQueHasTrabajado[index].fecha + '</td>';
            html += '<td class="odd">' + formatSecondstoHours(diasQueHasTrabajado[index].tiempoTrabajado) + '</td>';
            html += '</tr>';
        }

        html += '	</tbody>';
        html += '</table>';
        $(selector).html(html);

    }

    function getDates(days, text) {
        $('.pagesize').append($('<option>', {
            value: days,
            text: text,
        }));
        $('#myTable').trigger('pageSize', days);
        $('#myTable').trigger('appendCache', days);
        $('#myTable').trigger('applyWidgetId', days);
        $('#myTable').trigger('applyWidgets', days);
        $('#myTable').trigger('load', days);
        $('#myTable').trigger('sorton', days);
        $('#myTable').trigger('unload', days);
        $('#myTable').trigger('update', days);
        $('#myTable').trigger('updateCell', days);
        $('#myTable').trigger('updateCell', days);
    }

    function getLast21FromDate(referenceDate) {
        var last21;

        if (referenceDate.getMonth() === 0) {
            last21 = new Date(referenceDate.getFullYear()-1, 12, 21);
        } else {
            last21 = new Date(referenceDate.getFullYear(), referenceDate.getMonth()-1, 21);
        }

        return last21;
    }

    function getWeekendDays(date1, date2) {
        var weekendDayCount = 0;

        while(date1 < date2){
            if(date1.getDay() === 0 || date1.getDay() === 6){
                ++weekendDayCount ;
            }
            date1.setDate(date1.getDate() + 1);
        }

        return weekendDayCount ;
    }

    function getDaysDifference(date1, date2) {
        return Math.round(Math.abs(date1 - date2) / 8.64e7);
    }

    /**
     function showLicense() {
        console.log('----------------------------------------------------------------------------');
        console.log('"THE BEER-WARE LICENSE 🍺" (Revision 42):');
        console.log('<Vistoraso> wrote this file. As long as you retain this notice you');
        console.log('can do whatever you want with this stuff. If we meet some day, and you think');
        console.log('this stuff is worth it, you can buy me a beer in return.');
        console.log('%c -The King In The Front', 'font-style: italic;', ' 👑 ');
        console.log(' ----------------------------------------------------------------------------');

    }
     **/


});