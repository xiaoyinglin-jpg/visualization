// 导入mockData数据
import mockData from "./mockData.js";

// 监听筛选按钮事件
document.addEventListener('DOMContentLoaded', function (){
    // 检查是否是从浏览器返回按钮返回
    window.addEventListener('pageshow', function(event) {
        // 当页面显示时，包括从缓存恢复时
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            // 清除筛选条件和取消复选框勾选
            clearAllFilters();
            document.getElementById('visualCheckbox').checked = false;
        }
    });
    
    document.getElementById('filterButton').addEventListener('click', applyFilters);

    document.getElementById('visualCheckbox').addEventListener('change', function () {
        if (this.checked) {
            visualizeData();
        }
    });

    // 添加筛选条件互斥功能
    const idInput = document.getElementById('studentId');
    const nameInput = document.getElementById('studentName');
    const otherFilters = document.querySelectorAll('select');
    
    // ID输入框与其他筛选条件互斥
    idInput.addEventListener('input', function() {
        if (this.value) {
            nameInput.value = '';
            nameInput.disabled = true;
            otherFilters.forEach(filter => {
                filter.value = '';
                filter.disabled = true;
            });
        } else {
            nameInput.disabled = false;
            otherFilters.forEach(filter => {
                filter.disabled = false;
            });
        }
    });
    
    // 姓名输入框与其他筛选条件互斥
    nameInput.addEventListener('input', function() {
        if (this.value) {
            idInput.value = '';
            idInput.disabled = true;
            otherFilters.forEach(filter => {
                filter.value = '';
                filter.disabled = true;
            });
        } else {
            idInput.disabled = false;
            otherFilters.forEach(filter => {
                filter.disabled = false;
            });
        }
    });
    
    // 其他筛选条件与ID、姓名互斥
    otherFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.value) {
                idInput.value = '';
                idInput.disabled = true;
                nameInput.value = '';
                nameInput.disabled = true;
            } else {
                // 只有当所有其他筛选条件都为空时才启用ID和姓名输入
                const anyFilterHasValue = Array.from(otherFilters).some(f => f.value !== '');
                if (!anyFilterHasValue) {
                    idInput.disabled = false;
                    nameInput.disabled = false;
                }
            }
        });
    });

    // 映射表，用于将数字编码转换为中文描述（仅在打印时使用）  
    const mappings = {
        gender: { "1": "男", "2": "女" },
        grade: { "1": "七年级", "2": "八年级", "3": "九年级" },
        residence: { "1": "农村", "2": "城镇" },
        onlyChild: { "1": "独生", "2": "非独生" },
        leftBehind: { "1": "留守儿童", "2": "非留守儿童" },
        familyStructure: { "1": "双亲", "2": "单亲" },
        EE_Post_P:{},
        EE_Post_S:{},
        ASE:{},
        AB:{},
};

// 定义一个函数来根据 EE_Post_P 的分数返回等级  
function getEEPostPLevel(score) {
    if (score <= 0.8) {
        return '非常低';
    } else if (score <= 1.6) {
        return '比较低';
    } else if (score <= 2.4) {
        return '不能确定';
    } else if (score <= 3.2) {
        return '比较高';
    } else {
        return '非常高';
    }
}

// 定义一个函数来根据 EE_Post_S 的分数返回等级  
function getEEPostSLevel(score) {
    if (score <= 0.8) {
        return '非常低';
    } else if (score <= 1.6) {
        return '比较低';
    } else if (score <= 2.4) {
        return '不能确定';
    } else if (score <= 3.2) {
        return '比较高';
    } else {
        return '非常高';
    }
}  


// 定义一个函数来根据 ASE 的分数返回等级  
function getASE(score) {
    if (score <= 1.0) {
        return '非常低';
    } else if (score <= 2.0) {
        return '比较低';
    } else if (score <= 3.0) {
        return '不能确定';
    } else if (score <= 4.0) {
        return '比较高';
    } else {
        return '非常高';
    }
}

// 定义一个函数来根据 AB 的分数返回等级  
function getAB(score) {
    if (score <= 1.0) {
        return '非常低';
    } else if (score <= 2.0) {
        return '比较低';
    } else if (score <= 3.0) {
        return '不能确定';
    } else if (score <= 4.0) {
        return '比较高';
    } else {
        return '非常高';
    }
}


// 处理筛选条件
function applyFilters(){
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const gender = document.getElementById('gender').value;
    const grade = document.getElementById('grade').value;
    const residence = document.getElementById('residence').value;
    const onlyChild = document.getElementById('onlyChild').value;
    const leftBehind = document.getElementById('leftBehind').value;
    const familyStructure = document.getElementById('familyStructure').value;

    // 筛选数据
    const filteredData = mockData.filter(item =>
        (!studentId || item.id === studentId) &&
        (!studentName || item.name === studentName) &&
        (!gender || item.gender === gender) &&
        (!grade || item.grade === grade) &&
        (!residence || item.residence === residence) &&
        (!onlyChild || item.onlyChild === onlyChild) &&
        (!leftBehind || item.leftBehind === leftBehind) &&
        (!familyStructure || item.familyStructure === familyStructure)
    );

    displayFormattedData(filteredData);
    
    // 保存当前是否为个人数据查询
    const isIndividual = (studentId !== '' || studentName !== '') && filteredData.length === 1;
    localStorage.setItem('isIndividualView', isIndividual);
    
    // 如果是个人数据，保存个人数据到localStorage
    if(isIndividual) {
        localStorage.setItem('individualData', JSON.stringify(filteredData[0]));
        // 保存查询类型
        if (studentId !== '') {
            localStorage.setItem('queryType', 'id');
        } else if (studentName !== '') {
            localStorage.setItem('queryType', 'name');
        }
    }
}

// 清除所有筛选条件的函数
function clearAllFilters() {
    // 清除输入框的值
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    
    // 清除所有下拉框的选择
    document.getElementById('gender').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('residence').value = '';
    document.getElementById('onlyChild').value = '';
    document.getElementById('leftBehind').value = '';
    document.getElementById('familyStructure').value = '';
    
    // 启用所有输入框和选择框
    document.getElementById('studentId').disabled = false;
    document.getElementById('studentName').disabled = false;
    document.querySelectorAll('select').forEach(select => {
        select.disabled = false;
    });
}

// 在文件开头，数据加载后立即执行
mockData.forEach((item, index) => {
    item.id = ('00000' + (index + 1)).slice(-5);
});

// 显示数据（使用表格）  
function displayFormattedData(data) {
    const tbody = document.querySelector('#dataOutputTable tbody');
    tbody.innerHTML = ''; // 清空之前的表格内容  

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12">未找到匹配的数据</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `  
                    <td>${item.id}</td>  
                    <td>${mappings.gender[item.gender]}</td>  
                    <td>${item.age}</td>  
                    <td>${mappings.grade[item.grade]}</td>  
                    <td>${mappings.residence[item.residence]}</td>  
                    <td>${mappings.onlyChild[item.onlyChild]}</td>  
                    <td>${mappings.leftBehind[item.leftBehind] === '1' ? '是' : '否'}</td>  
                    <td>${mappings.familyStructure[item.familyStructure]}</td>  
                    <td>${getEEPostPLevel(item.EE_Post_P)}</td>
                    <td>${getEEPostSLevel(item.EE_Post_S)}</td>
                    <td>${getASE(item.ASE)}</td>
                    <td>${getAB(item.AB)}</td>
                `;
        tbody.appendChild(row);
    });

    // 将数据存储到 localStorage，供可视化页面使用
    localStorage.setItem('filteredData', JSON.stringify(data));
}

// 跳转到可视化页面
function visualizeData() {
    const isIndividual = localStorage.getItem('isIndividualView') === 'true';
    console.log("Is individual view:", isIndividual); // 添加调试日志
    
    if(isIndividual) {
        window.location.href = 'individual_visualization.html';
    } else {
        window.location.href = 'visualization.html';
    }
}

displayFormattedData(mockData);

})
