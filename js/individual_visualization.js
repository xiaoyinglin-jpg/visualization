document.addEventListener('DOMContentLoaded', function() {
    const individualData = JSON.parse(localStorage.getItem('individualData'));
    const queryType = localStorage.getItem('queryType'); // 获取查询类型
    
    // 导入所有学生数据
    import('../js/mockData.js').then(module => {
        const mockData = module.default;
        
        // 显示基本信息
        document.getElementById('studentId').textContent = individualData.id;
        // 只有在通过姓名查询时才显示姓名
        if (queryType === 'name') {
            document.getElementById('studentName').textContent = individualData.name;
        } else {
            // 如果是通过ID查询，隐藏姓名行
            document.getElementById('studentName').parentElement.style.display = 'none';
        }
        
        // 计算排名和百分位
        function calculateRankAndPercentile(value, allValues, key) {
            const sortedValues = allValues.map(item => parseFloat(item[key]))
                .sort((a, b) => b - a);
            const rank = sortedValues.indexOf(parseFloat(value)) + 1;
            const totalStudents = allValues.length;
            const percentile = ((totalStudents - rank + 1) / totalStudents * 100).toFixed(2);
            
            return {
                rank: `${rank}/${totalStudents}`,
                percentile: `${percentile}%`
            };
        }
        
        // 更新各项指标的数据
        const metrics = {
            'EE_Post_P': {valueId: 'parentExpValue', rankId: 'parentExpRank', percentileId: 'parentExpPercentile'},
            'EE_Post_S': {valueId: 'childExpValue', rankId: 'childExpRank', percentileId: 'childExpPercentile'},
            'ASE': {valueId: 'aseValue', rankId: 'aseRank', percentileId: 'asePercentile'},
            'AB': {valueId: 'abValue', rankId: 'abRank', percentileId: 'abPercentile'}
        };
        
        Object.entries(metrics).forEach(([key, ids]) => {
            const value = individualData[key];
            document.getElementById(ids.valueId).textContent = value;
            // 使用完整的mockData计算排名，而不是筛选后的数据
            const {rank, percentile} = calculateRankAndPercentile(value, mockData, key);
            document.getElementById(ids.rankId).textContent = rank;
            document.getElementById(ids.percentileId).textContent = percentile;
        });
        
        // 雷达图
        const radarChart = echarts.init(document.getElementById('radarChart'));
        const radarOption = {
            title: {
                text: '个人指标雷达图'
            },
            radar: {
                indicator: [
                    { name: '父母教育期望', max: 4 },
                    { name: '孩子教育期望', max: 4 },
                    { name: '学业自我效能感', max: 5 },
                    { name: '学业倦怠', max: 5 }
                ]
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [
                        individualData.EE_Post_P,
                        individualData.EE_Post_S,
                        individualData.ASE,
                        individualData.AB
                    ],
                    name: '个人指标'
                }]
            }]
        };
        radarChart.setOption(radarOption);
        
        // 柱状图
        const barChart = echarts.init(document.getElementById('barChart'));
        const barOption = {
            title: {
                text: '指标对比图'
            },
            tooltip: {},
            xAxis: {
                data: ['父母期望', '孩子期望', '自我效能感', '学业倦怠']
            },
            yAxis: {},
            series: [{
                name: '数值',
                type: 'bar',
                data: [
                    individualData.EE_Post_P,
                    individualData.EE_Post_S,
                    individualData.ASE,
                    individualData.AB
                ]
            }]
        };
        barChart.setOption(barOption);
    }).catch(error => {
        console.error('Error loading mockData:', error);
    });
}); 