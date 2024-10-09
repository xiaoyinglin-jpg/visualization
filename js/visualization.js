// 获取保存的数据
const data = JSON.parse(localStorage.getItem("filteredData"));

// 定义统计结果
const stats = {
    gender: {
        male: 0,  // gender 1 -> male
        female: 0 // gender 2 -> female
    },
    age: {},
    residence: {
        urban: 0,  // residence 1 -> urban
        rural: 0   // residence 2 -> rural
    },
    grade: {
        primary: 0, // grade 1 -> primary
        middle: 0, // grade 2 -> middle
        high: 0    // grade 3 -> high
    },
    onlyChild: {
        yes: 0,  // onlyChild 1 -> yes
        no: 0    // onlyChild 2 -> no
    },
    onlyChildGender: {
        onlyChildMale: 0,  // 只有一个男孩
        onlyChildFemale: 0, // 只有一个女孩
        nonOnlyChildMale: 0, // 非独生男
        nonOnlyChildFemale: 0 // 非独生女
    },
    leftBehind: {
        yes: 0,  // leftBehind 1 -> yes
        no: 0    // leftBehind 2 -> no
    },
    familyStructure: {
        nuclear: 0,  // familyStructure 1 -> nuclear
        extended: 0  // familyStructure 2 -> extended
    },
    EE_Post_P: {
        total: 0,  // Sum for calculating average later
        count: 0,  // Count for calculating average
        stages: {
            veryLow: 0,    // <= 1.5
            low: 0,        // <= 2.5
            moderate: 0,   // <= 3.5
            high: 0        // <= 4
        }
    },
    EE_Post_S: {
        total: 0,  // Sum for calculating average later
        count: 0,  // Count for calculating average
        stages: {
            veryLow: 0,    // <= 1.5
            low: 0,        // <= 2.5
            moderate: 0,   // <= 3.5
            high: 0        // <= 4
        }
    },
    ASE: {
        total: 0,
        count: 0,
        intervals: {
            veryLow: 0,  // <= 1
            low: 0,      // <= 2
            moderate: 0, // <= 3
            high: 0,     // <= 4
            veryHigh: 0  // <= 5
        }
    },
    AB: {
        total: 0,
        count: 0,
        intervals: {
            veryLow: 0,  // <= 1
            low: 0,      // <= 2
            moderate: 0, // <= 3
            high: 0,     // <= 4
            veryHigh: 0  // <= 5
        }
    },

    // 家庭结构数据统计
    familyStructureCount: {
        singleParent: 0, // 单亲总数  
        dualParent: 0    // 双亲总数  
    }
};

// 学业效能和学业倦怠散点图数据
const aseAbData = [];



// 代际期望差距和学业效能和学业倦怠的关系图数据
// 定义统计结构（基于代际教育期望差距） - 包含 ToASE 和 ToAB
const intergenerationalGapStats = {
    noGap: { ToASE: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, ToAB: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, count: 0 },
    smallGap: { ToASE: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, ToAB: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, count: 0 },
    significantGap: { ToASE: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, ToAB: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, count: 0 },
    largeGap: { ToASE: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, ToAB: { veryLow: 0, low: 0, moderate: 0, high: 0, veryHigh: 0 }, count: 0 }
};

// 遍历数据进行统计
data.forEach(row => {
    // 统计 gender 出现的次数
    if (row.gender === "1") stats.gender.male++;
    if (row.gender === "2") stats.gender.female++;

    // 统计 age 各个取值的次数
    stats.age[row.age] = (stats.age[row.age] || 0) + 1;

    // 统计grade出现的次数
    if (row.grade === "1") stats.grade.primary++;
    if (row.grade === "2") stats.grade.middle++;
    if (row.grade === "3") stats.grade.high++;

    // 统计 residence, onlyChild, leftBehind, familyStructure
    if (row.residence === "1") stats.residence.urban++;
    if (row.residence === "2") stats.residence.rural++;

    if (row.onlyChild === "1") stats.onlyChild.yes++;
    if (row.onlyChild === "2") stats.onlyChild.no++;

    // 更新独生子女性别统计
    if (row.onlyChild === "1") { // 是独生子女
        if (row.gender === "1") {
            stats.onlyChildGender.onlyChildMale++;
        } else if (row.gender === "2") {
            stats.onlyChildGender.onlyChildFemale++;
        }
    } else { // 非独生子女
        if (row.gender === "1") {
            stats.onlyChildGender.nonOnlyChildMale++;
        } else if (row.gender === "2") {
            stats.onlyChildGender.nonOnlyChildFemale++;
        }
    }

    if (row.leftBehind === "1") stats.leftBehind.yes++;
    if (row.leftBehind === "2") stats.leftBehind.no++;

    if (row.familyStructure === "1") stats.familyStructure.nuclear++;
    if (row.familyStructure === "2") stats.familyStructure.extended++;

    // 统计 EE_Post_P
    const EE_Post_P = parseFloat(row.EE_Post_P);
    if (EE_Post_P <= 1.5) stats.EE_Post_P.stages.veryLow++;
    else if (EE_Post_P <= 2.5) stats.EE_Post_P.stages.low++;
    else if (EE_Post_P <= 3.5) stats.EE_Post_P.stages.moderate++;
    else if (EE_Post_P <= 4.0) stats.EE_Post_P.stages.high++;
    stats.EE_Post_P.total += EE_Post_P;
    stats.EE_Post_P.count++;

    // 统计 EE_Post_S
    const EE_Post_S = parseFloat(row.EE_Post_S);
    if (EE_Post_S <= 1.5) stats.EE_Post_S.stages.veryLow++;
    else if (EE_Post_S <= 2.5) stats.EE_Post_S.stages.low++;
    else if (EE_Post_S <= 3.5) stats.EE_Post_S.stages.moderate++;
    else if (EE_Post_S <= 4.0) stats.EE_Post_S.stages.high++;
    stats.EE_Post_S.total += EE_Post_S;
    stats.EE_Post_S.count++;

    // 统计 ASE
    const ASE = parseFloat(row.ASE);
    if (ASE <= 1) stats.ASE.intervals.veryLow++;
    else if (ASE <= 2) stats.ASE.intervals.low++;
    else if (ASE <= 3) stats.ASE.intervals.moderate++;
    else if (ASE <= 4) stats.ASE.intervals.high++;
    else if (ASE <= 5) stats.ASE.intervals.veryHigh++;
    stats.ASE.total += ASE;
    stats.ASE.count++;

    // 统计 AB
    const AB = parseFloat(row.AB);
    if (AB <= 1) stats.AB.intervals.veryLow++;
    else if (AB <= 2) stats.AB.intervals.low++;
    else if (AB <= 3) stats.AB.intervals.moderate++;
    else if (AB <= 4) stats.AB.intervals.high++;
    else if (AB <= 5) stats.AB.intervals.veryHigh++;
    stats.AB.total += AB;
    stats.AB.count++;

    // 收集ASE和AB的数据
    const ASE_data = parseFloat(row.ASE);
    const AB_data = parseFloat(row.AB);
    const label = row.name; // 从数据中获取学生姓名
    // 确保 ASE_data 和 AB_data 是有效数值
    if (!isNaN(ASE_data) && !isNaN(AB_data)) {
        aseAbData.push({
            ASE_data,
            AB_data,
            label: label || '未知学生' // 如果没有姓名，用默认值
        });
    }
    console.log('aseAbData:', aseAbData); // 输出检查数据格式

    // 收集对应的ASE和AB数据
    const gap = Math.abs(EE_Post_P - EE_Post_S); // 计算差值的绝对值
    const ToASE = parseFloat(row.ASE);
    const ToAB = parseFloat(row.AB);

    // 确定差距类别
    let gapCategory;
    if (gap <= 1) {
        gapCategory = 'noGap';
    } else if (gap <= 2) {
        gapCategory = 'smallGap';
    } else if (gap <= 3) {
        gapCategory = 'significantGap';
    } else if (gap <= 4) {
        gapCategory = 'largeGap';
    }

    // 将 ToASE 数据按照其等级分组统计
    if (gapCategory) {
        if (ToASE <= 1) intergenerationalGapStats[gapCategory].ToASE.veryLow++;
        else if (ToASE <= 2) intergenerationalGapStats[gapCategory].ToASE.low++;
        else if (ToASE <= 3) intergenerationalGapStats[gapCategory].ToASE.moderate++;
        else if (ToASE <= 4) intergenerationalGapStats[gapCategory].ToASE.high++;
        else if (ToASE <= 5) intergenerationalGapStats[gapCategory].ToASE.veryHigh++;

        // 将 ToAB 数据按照其等级分组统计
        if (ToAB <= 1) intergenerationalGapStats[gapCategory].ToAB.veryLow++;
        else if (ToAB <= 2) intergenerationalGapStats[gapCategory].ToAB.low++;
        else if (ToAB <= 3) intergenerationalGapStats[gapCategory].ToAB.moderate++;
        else if (ToAB <= 4) intergenerationalGapStats[gapCategory].ToAB.high++;
        else if (ToAB <= 5) intergenerationalGapStats[gapCategory].ToAB.veryHigh++;

        // 统计每个组的总数
        intergenerationalGapStats[gapCategory].count++;
    }

    // 统计单亲和双亲数据 （1是双亲，2是单亲）
    if (row.familyStructure === "1") {
        stats.familyStructureCount.dualParent++;
    } else if (row.familyStructure === "2") {
        stats.familyStructureCount.singleParent++;
    }  
    

});


// 输出结果
console.log("Gender count (Male):", stats.gender.male);
console.log("Gender count (Female):", stats.gender.female);
console.log("Age frequencies:", stats.age);
console.log("Grade(primary):", stats.grade.primary);
console.log("Grade(middle):", stats.grade.middle);
console.log("Grade(high):", stats.grade.high);
console.log("Residence (Urban):", stats.residence.urban);
console.log("Residence (Rural):", stats.residence.rural);
console.log("OnlyChild (Yes):", stats.onlyChild.yes);
console.log("OnlyChild (No):", stats.onlyChild.no);
console.log("OnlyChildGender (onlyChildMale):", stats.onlyChildGender.onlyChildMale);
console.log("OnlyChildGender (onlyChildFemale):", stats.onlyChildGender.onlyChildFemale);
console.log("OnlyChildGender (nonOnlyChildMale):", stats.onlyChildGender.nonOnlyChildMale);
console.log("OnlyChildGender (nonOnlyChildFemale):", stats.onlyChildGender.nonOnlyChildFemale);
console.log("LeftBehind (Yes):", stats.leftBehind.yes);
console.log("LeftBehind (No):", stats.leftBehind.no);
console.log("FamilyStructure (Nuclear):", stats.familyStructure.nuclear);
console.log("FamilyStructure (Extended):", stats.familyStructure.extended);
console.log("EE_Post_P stages:", stats.EE_Post_P.stages);
console.log("EE_Post_S stages:", stats.EE_Post_S.stages);
console.log("ASE intervals:", stats.ASE.intervals);
console.log("AB intervals:", stats.AB.intervals);
// 输出所有 ASE 和 AB 的数据对  
aseAbData.forEach((item, index) => {
    console.log(`数据对 ${index + 1}:`);
    console.log(`ASE: ${item.ASE_data}, AB: ${item.AB_data}`);
});  

// 计算每个代际差距下 ToASE 和 ToAB 等级的比例
function calculateProportions(groupStats) {
    const proportions = {};
    if (groupStats.count === 0) {
        return { ToASE: {}, ToAB: {} };  // 如果 count 为 0，返回空对象，避免除以 0
    }
  
    Object.keys(groupStats.ToASE).forEach(level => {
        proportions.ToASE = proportions.ToASE || {};
        proportions.ToASE[level] = (groupStats.ToASE[level] / groupStats.count) * 100; // 转换为百分比
    });
    Object.keys(groupStats.ToAB).forEach(level => {
        proportions.ToAB = proportions.ToAB || {};
        proportions.ToAB[level] = (groupStats.ToAB[level] / groupStats.count) * 100; // 转换为百分比
    });
    return proportions;
}

// 获取不同代际差距下的比例
const gapProportions = {
    noGap: calculateProportions(intergenerationalGapStats.noGap),
    smallGap: calculateProportions(intergenerationalGapStats.smallGap),
    significantGap: calculateProportions(intergenerationalGapStats.significantGap),
    largeGap: calculateProportions(intergenerationalGapStats.largeGap)
}

// 生成 ECharts 数据格式（ToASE 和 ToAB 数据）
const datasetSourceToASE = [
    ['Level', '无差距', '小差距', '显著差距', '巨大差距'],
    ['非常低', gapProportions.noGap.ToASE.veryLow || 0, gapProportions.smallGap.ToASE.veryLow || 0, gapProportions.significantGap.ToASE.veryLow || 0, gapProportions.largeGap.ToASE.veryLow || 0],
    ['比较低', gapProportions.noGap.ToASE.low || 0, gapProportions.smallGap.ToASE.low || 0, gapProportions.significantGap.ToASE.low || 0, gapProportions.largeGap.ToASE.low || 0],
    ['不确定', gapProportions.noGap.ToASE.moderate || 0, gapProportions.smallGap.ToASE.moderate || 0, gapProportions.significantGap.ToASE.moderate || 0, gapProportions.largeGap.ToASE.moderate || 0],
    ['比较高', gapProportions.noGap.ToASE.high || 0, gapProportions.smallGap.ToASE.high || 0, gapProportions.significantGap.ToASE.high || 0, gapProportions.largeGap.ToASE.high || 0],
    ['非常高', gapProportions.noGap.ToASE.veryHigh || 0, gapProportions.smallGap.ToASE.veryHigh || 0, gapProportions.significantGap.ToASE.veryHigh || 0, gapProportions.largeGap.ToASE.veryHigh || 0]
];

const datasetSourceToAB = [
    ['Level', '无差距', '小差距', '显著差距', '巨大差距'],
    ['非常低', gapProportions.noGap.ToAB.veryLow || 0, gapProportions.smallGap.ToAB.veryLow || 0, gapProportions.significantGap.ToAB.veryLow || 0, gapProportions.largeGap.ToAB.veryLow || 0],
    ['比较低', gapProportions.noGap.ToAB.low || 0, gapProportions.smallGap.ToAB.low || 0, gapProportions.significantGap.ToAB.low || 0, gapProportions.largeGap.ToAB.low || 0],
    ['不确定', gapProportions.noGap.ToAB.moderate || 0, gapProportions.smallGap.ToAB.moderate || 0, gapProportions.significantGap.ToAB.moderate || 0, gapProportions.largeGap.ToAB.moderate || 0],
    ['比较高', gapProportions.noGap.ToAB.high || 0, gapProportions.smallGap.ToAB.high || 0, gapProportions.significantGap.ToAB.high || 0, gapProportions.largeGap.ToAB.high || 0],
    ['非常高', gapProportions.noGap.ToAB.veryHigh || 0, gapProportions.smallGap.ToAB.veryHigh || 0, gapProportions.significantGap.ToAB.veryHigh || 0, gapProportions.largeGap.ToAB.veryHigh || 0]
];

console.log(intergenerationalGapStats);

// 家长期望饼图 main1
// 实例化对象
var myChart1 = echarts.init(document.getElementById('main1'));

var option1 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: true,  // 确保标签不重叠
            label: {
                show: true,  // 显示标签
                position: 'outside',  // 标签在饼图外部
                fontSize: 40,  // 调整标签字体大小
                formatter: '{b}: {c} ({d}%)',  // 格式化标签，显示名称、数值和百分比
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,  // 鼠标悬停时增大字体
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true,  // 显示标签的引导线
                length: 15,  // 调整引导线长度
                length2: 10,  // 调整引导线的第二段长度
                smooth: true  // 引导线平滑
            },
            data: [
                { value: stats.EE_Post_P.stages.veryLow, name: '比较低' },
                { value: stats.EE_Post_P.stages.low, name: '不能确定' },
                { value: stats.EE_Post_P.stages.moderate, name: '比较高' },
                { value: stats.EE_Post_P.stages.high, name: '非常高' }
            ]
        }
    ]
};

// 把配置项给实例对象
myChart1.setOption(option1);


// 学生自我期望饼图 main2
//实例化对象
var myChart2 = echarts.init(document.getElementById('main2'));

// 指定图表的配置项和数据
var option2 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: true,
            label: {
                show: false,
                position: 'outside',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: stats.EE_Post_S.stages.veryLow, name: '比较低' },
                { value: stats.EE_Post_S.stages.low, name: '不能确定' },
                { value: stats.EE_Post_S.stages.moderate, name: '比较高' },
                { value: stats.EE_Post_S.stages.high, name: '非常高' },
                
            ]
        }
    ]
};

// 把配置项给实例对象
myChart2.setOption(option2);

// 代际间期望对比图
var myChart3 = echarts.init(document.getElementById('main3'));
var option3 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['家长教育期望', '孩子自我期望']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value'
        }
    ],
    yAxis: [
        {
            type: 'category',
            axisTick: {
                show: false
            },
            data: ['比较低', '不能确定', '比较高', '非常高']
        }
    ],
    series: [
        {
            name: '家长教育期望',
            type: 'bar',
            label: {
                show: true,
                position: 'inside'
            },
            emphasis: {
                focus: 'series'
            },
            data: [stats.EE_Post_P.stages.veryLow, stats.EE_Post_P.stages.low, stats.EE_Post_P.stages.moderate, stats.EE_Post_P.stages.high]
        },

        {
            name: '孩子自我期望',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'left'
            },
            emphasis: {
                focus: 'series'
            },
            data: [-stats.EE_Post_S.stages.veryLow, -stats.EE_Post_S.stages.low, -stats.EE_Post_S.stages.moderate, -stats.EE_Post_S.stages.high]
        }
    ]
};
myChart3.setOption(option3)

// 学业自我效能感饼图 main4
//实例化对象
var myChart4 = echarts.init(document.getElementById('main4'));

var option4 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: true,
            padAngle: 20,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center',
                position: 'outside' // 将标签放置在外侧
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            itemStyle: {
                borderRadius: 10,
                borderWidth: 2, // 增加边框宽度
                borderColor: '#fff' // 设置边框颜色
            },
            data: [
                { value: stats.ASE.intervals.veryLow, name: '非常低' },
                { value: stats.ASE.intervals.low, name: '比较低' },
                { value: stats.ASE.intervals.moderate, name: '不能确定' },
                { value: stats.ASE.intervals.high, name: '比较高' },
                { value: stats.ASE.intervals.veryHigh, name: '非常高' }
            ]
        }
    ]
};

// 把配置项给实例对象
myChart4.setOption(option4);

// 学业倦怠饼图 main5
//实例化对象
var myChart5 = echarts.init(document.getElementById('main5'));

var option5 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '70%'],
            avoidLabelOverlap: true,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center',
                position: 'outside' // 将标签放置在外侧
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            data: [
                { value: stats.AB.intervals.veryLow, name: '非常低' },
                { value: stats.AB.intervals.low, name: '比较低' },
                { value: stats.AB.intervals.moderate, name: '不能确定' },
                { value: stats.AB.intervals.high, name: '比较高' },
                { value: stats.AB.intervals.veryHigh, name: '非常高' }
            ]
        }
    ]
};

// 把配置项给实例对象
myChart5.setOption(option5); 

// 学业效能和学业倦怠图 main6
var myChart6 = echarts.init(document.getElementById('main6'));
var option6 = {
    tooltip: {
        formatter: function (params) {
            const label = params.data.label || '未知学生';
            const ASE = params.data.ASE_data;
            const AB = params.data.AB_data;
            return `${label}<br/>学业效能: ${ASE}<br/>学业倦怠: ${AB}`;
        }
    },
    xAxis: {
        name: '学业效能',
        type: 'value'
    },
    yAxis: {
        name: '学业倦怠',
        type: 'value'
    },
    grid: {
        left: '10%',
        right: '23%', // 调整右边留白
        bottom: '3%',
        top: '20%',
        containLabel: true // 包含刻度标签
    },
    series: [{
        type: 'scatter',
        data: aseAbData.map(item => ({
            value: [item.ASE_data, item.AB_data],
            ASE_data: item.ASE_data,
            AB_data: item.AB_data,
            label: item.label // 确保 label 是字符串
        })),
        symbolSize: 10,
        itemStyle: {
            color: 'rgba(25, 144, 255, 0.8)'
        }
    }]
};

myChart6.setOption(option6);


// 代际差距下自我效能等级图 main7
var myChart7 = echarts.init(document.getElementById('main7'));
var option7 = {
   
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        confine: true  // 确保提示框不会超出图表容器
    },
    legend: {
        data: ['无差距', '小差距', '显著差距', '大差距'],
        left: 'left'
    },
    grid: {
        top:'20%',
        left: '3%',
        right: '15%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {
        name: '代际期望差距',
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        name: '学业效能等级',
        type: 'category',
        data: ['非常低', '比较低', '不确定', '比较高', '非常高']
    },
    series: [
        {
            name: '无差距',
            type: 'bar',
            data: [gapProportions.noGap.ToASE.veryLow || 0, gapProportions.noGap.ToASE.low || 0, gapProportions.noGap.ToASE.moderate || 0, gapProportions.noGap.ToASE.high || 0, gapProportions.noGap.ToASE.veryHigh || 0]
        },
        {
            name: '小差距',
            type: 'bar',
            data: [gapProportions.smallGap.ToASE.veryLow || 0, gapProportions.smallGap.ToASE.low || 0, gapProportions.smallGap.ToASE.moderate || 0, gapProportions.smallGap.ToASE.high || 0, gapProportions.smallGap.ToASE.veryHigh || 0]
        },
        {
            name: '显著差距',
            type: 'bar',
            data: [gapProportions.significantGap.ToASE.veryLow || 0, gapProportions.significantGap.ToASE.low || 0, gapProportions.significantGap.ToASE.moderate || 0, gapProportions.significantGap.ToASE.high || 0, gapProportions.significantGap.ToASE.veryHigh || 0]
        },
        {
            name: '大差距',
            type: 'bar',
            data: [gapProportions.largeGap.ToASE.veryLow || 0, gapProportions.largeGap.ToASE.low || 0, gapProportions.largeGap.ToASE.moderate || 0, gapProportions.largeGap.ToASE.high || 0, gapProportions.largeGap.ToASE.veryHigh || 0]
        }
    ]
};
myChart7.setOption(option7);

// 代际差距下学业倦怠 (AB) 等级图 main8
var myChart8 = echarts.init(document.getElementById('main8'));
// 配置条形图选项
var option8 = {
   
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['无差距', '小差距', '显著差距', '大差距'],
        left: 'left'
    },
    grid: {
        top: '20%',
        left: '3%',
        right: '15%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {
        name: '代际期望差距',
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        name: '学业倦怠等级',
        type: 'category',
        data: ['非常低', '比较低', '不确定', '比较高', '非常高']
    },
    series: [
        {
            name: '无差距',
            type: 'bar',
            data: [gapProportions.noGap.ToAB.veryLow || 0, gapProportions.noGap.ToAB.low || 0, gapProportions.noGap.ToAB.moderate || 0, gapProportions.noGap.ToAB.high || 0, gapProportions.noGap.ToAB.veryHigh || 0]
        },
        {
            name: '小差距',
            type: 'bar',
            data: [gapProportions.smallGap.ToAB.veryLow || 0, gapProportions.smallGap.ToAB.low || 0, gapProportions.smallGap.ToAB.moderate || 0, gapProportions.smallGap.ToAB.high || 0, gapProportions.smallGap.ToAB.veryHigh || 0]
        },
        {
            name: '显著差距',
            type: 'bar',
            data: [gapProportions.significantGap.ToAB.veryLow || 0, gapProportions.significantGap.ToAB.low || 0, gapProportions.significantGap.ToAB.moderate || 0, gapProportions.significantGap.ToAB.high || 0, gapProportions.significantGap.ToAB.veryHigh || 0]
        },
        {
            name: '大差距',
            type: 'bar',
            data: [gapProportions.largeGap.ToAB.veryLow || 0, gapProportions.largeGap.ToAB.low || 0, gapProportions.largeGap.ToAB.moderate || 0, gapProportions.largeGap.ToAB.high || 0, gapProportions.largeGap.ToAB.veryHigh || 0]
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart8.setOption(option8);



// 年级柱状图 main9
// 实例化对象

var myChart9 = echarts.init(document.getElementById('main9'));
var option9 = {
    tooltip: {
        trigger: 'axis', // 设置为 'axis' 可以在悬停时显示当前轴上所有数据
        axisPointer: {
            type: 'shadow' // 将指示器类型设置为阴影指示器，更适合柱状图
        },
        formatter: function (params) {
            const data = params[0]; // 获取当前悬停的数据点信息
            return `${data.name}: ${data.value}`;
        }
    },
    xAxis: {
        type: 'category',
        data: ['七年级', '八年级', '九年级'],
        axisLabel: {
            color: 'lightgreen' // 设置 X 轴标签的颜色为浅绿色
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: 'lightgreen' // 设置 Y 轴标签的颜色为浅绿色
        }
    },
    series: [
        {
            data: [stats.grade.primary, stats.grade.middle, stats.grade.high],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: {
                color: 'rgb(173, 216, 230)' // 设置柱子的颜色为浅蓝色（RGB格式）
            },
            barWidth: '30%', // 设置柱子的宽度为30%
            label: {
                show: true, // 显示数值
                position: 'top', // 数值显示在柱子顶端
                offset: [0, 5], // 数值和柱子之间的空隙（5像素）
                color: 'black' // 设置数值颜色为黑色
            }
        }
    ]
};

myChart9.setOption(option9);



// 学生性别饼图
var myChart10 = echarts.init(document.getElementById('main10'));
var option10 = {

    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: '80%',
            data: [
                { value: stats.gender.male, name: '男' },
                { value: stats.gender.female, name: '女' },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
myChart10.setOption(option10);  

// 家庭居住地饼图
var myChart11 = echarts.init(document.getElementById('main11'));
var option11 = {

    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: '80%',
            data: [
                { value: stats.residence.rural, name: '农村' },
                { value: stats.residence.urban, name: '城镇' },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
myChart11.setOption(option11);  

// 独生状况图
var myChart12 = echarts.init(document.getElementById('main12'));
var option12 = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['独生', '非独生']
    },
    series: [
        {
            name: '男',
            type: 'bar',
            data: [stats.onlyChildGender.onlyChildMale, stats.onlyChildGender.nonOnlyChildMale]  
        },
        {
            name: '女',
            type: 'bar',
            data: [stats.onlyChildGender.onlyChildFemale, stats.onlyChildGender.nonOnlyChildFemale]
    }
    ]
};
myChart12.setOption(option12);


// 留守儿童饼图
var myChart13 = echarts.init(document.getElementById('main13'));
const piePatternSrc =
    'data:image/jpeg;base64,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';
const bgPatternSrc =
    'data:image/png;base64,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';
const piePatternImg = new Image();
piePatternImg.src = piePatternSrc;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;
var option13 = {
   
    title: {
        textStyle: {
            color: '#235894'
        }
    },
    tooltip: {},
    grid: {
        left: '10%',   // 调整左边距
        right: '10%',  // 调整右边距
        top: '10%',    // 调整上边距
        bottom: '200%', // 调整下边距
    },
    series: [
        {
            name: 'pie',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 30,
            clockwise: true,
            label: {
                fontSize: 18,
                color: '#235894'
            },
            labelLine: {
                lineStyle: {
                    color: '#235894'
                }
            },
            data: [
                { value: stats.leftBehind.yes, name: '留守儿童' },
                { value: stats.leftBehind.no, name: '非留守儿童' },

            ],
            itemStyle: {
                opacity: 0.7,
                color: {
                    image: piePatternImg,
                    repeat: 'repeat'
                },
                borderWidth: 3,
                borderColor: '#235894'
            }
        }
    ]
};
myChart13.setOption(option13);


// 家庭结构饼状图
var myChart14 = echarts.init(document.getElementById('main14'));

// 配置饼状图的选项  
var option14 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: '80%',
            data: [
                { value: stats.familyStructureCount.singleParent, name: '单亲' },
                { value: stats.familyStructureCount.dualParent, name: '双亲' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

// 使用配置生成图表  
myChart14.setOption(option14);
