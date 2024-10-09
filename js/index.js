window.onload = function () {
    // 实例化对象
    var myChart = echarts.init(document.getElementById('main2'));

    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 30,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 0, name: '非常低' },
                    { value: 11, name: '比较低' },
                    { value: 167, name: '不能确定' },
                    { value: 463, name: '比较高' },
                    { value: 104, name: '非常高' }
                ]
            }
        ]
    };

    // 把配置项给实例对象
    myChart.setOption(option);
};
