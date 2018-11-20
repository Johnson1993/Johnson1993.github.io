var common = {};
var loading;

//if(!top) {
//	top = {};
//	top.parameters = [];
//}




//兼容app手机端 xuzhou
window.top=window.top||window.self;
var parameters={};

// 全局Ajax配置
$.ajaxSetup({
	global : true,
	cache : false,
	error : function(jqXHR, textStatus, errorThrown) {
//		if(jqXHR.responseText==''){//chrome拦截不到后端异常信息，这里写死
//			common.info("服务器端异常，请联系管理员。");
//		}else{			
			common.info(jqXHR.responseText);
//		}
		//保存按钮去掉disabled 可以再次提交
		if($("#btns").length){
			$("#btns :button:disabled").removeAttr("disabled");
		}
		//出错时候关闭滚动条，即时未曾打开滚动条，关闭也是安全的不会报错
		common.closepageloading();
	},
	beforeSend : function (a, b) {
		if(b.loading != false) {
			common.openpageloading();
		}
	},
	complete : function () {
		common.closepageloading();
	}
});

common.resizeGrid = function(gridId) {
	if (gridId) {
		$('#' + gridId).datagrid('resize');
	} else {
		$('#datagrid').datagrid('resize');
	}
};
// formRset 清空隐藏变量
common.resetForm = function(formId) {
	if ($("input[type='hidden']"),$("#" + formId)) {
		$("input[type='hidden']",$("#" + formId)).val('');
	}
	document.getElementById(formId).reset();
};
// formRset 不清空隐藏变量
common.resetFormNotResetHidden = function(formId) {
	document.getElementById(formId).reset();
};

common.form2Json = function(formId) {
	return common.strToJson($("#" + formId).serialize());
};

common.strToJson = function(str) {
	str = str.replace(/&/g, "','");
	str = str.replace(/=/g, "':'");
	str = "({'" + str + "'})";
	var obj = eval(str);
	return obj;
};

common.error = function(message, fn) {
	common.createMessage('错误', message, false, fn);
};
/**
 * message 提示信息；
 * fn  正常回调函数；
 */
common.info = function(message, fn) {
	common.createMessage('提示', message, false, fn, Array.prototype.slice.call(
			arguments, 2));
};

common.confirm = function(message, fn, fnCancel) {
	common.createMessage('确认', message, true, fn, fnCancel, Array.prototype.slice.call(
			arguments, 2));
};

common.warning = function(message, fn) {
	common.createMessage('警告', message, false, fn, Array.prototype.slice.call(
			arguments, 2));
};

common.createMessage = function(title, message, showCloseButton, fn, fnCancel) {
//	if(message=='')
//	{
//		message='请关闭';
//	}
	var args = Array.prototype.slice.call(arguments, 4);
	if(message) {
		top.$.teninedialog({
			title : title,
			content : message,
			showCloseButton : showCloseButton,
			bootstrapModalOption : {
				keyboard : true,
				backdrop : 'static'
			},
			clickButton : function() {
				if ($.isFunction(fn)) {
					return fn.apply(null, args);
				}
			},
			clickCancelButton: function() {
				if ($.isFunction(fnCancel)) {
					return fnCancel.apply(null, args);
				}
			}
		});
	}else{
		if ($.isFunction(fn)) {
			return fn.apply(null, args);
		}
	}
};
//默认去除两边的空格，当is_global参数为true时，是去除所有的空格
common.trimBlank=function (str,is_global){
	var result= str.replace(/(^\s+)|(\s+$)/g,"");
    if(!common.isEmpty(is_global)&&is_global)
     {
        result = result.replace(/\s/g,"");
     }
    return result;
};
//判断值是否为空
common.isEmpty=function (value) {
    if (value == null ||typeof(value)==undefined|| $.trim(value) == "") {
        return true;
    } else {
        return false;
    }
};


//为空,则返回 ''
common.getOrElse=function (value){

    if(common.isEmpty(value)){
       return '';
    }
    
    return value;
};

//如何value为null返回空，否则返回本身；
common.transResult=function (value) {
	if(common.isEmpty(value)){
		return "";
	}else{
		return value;
	}
};
common.closeModelDialog = function(dialogId) {
	$('#' + dialogId).modal('hide');
};
common.closeModelDialogClear = function(dialogId) {
	$('#'+dialogId).html('');
	$('#' + dialogId).modal('hide');
};
/**
 * 参数name为checkbox的name
 */
common.removeRow = function(name) {
	var checkBoxs = $("input[name=" + name + "]:checked");
	checkBoxs.each(function() {
		$(this).parent().parent().remove();
	});
};

common.year = function(divId, endDate, options) {
	var maxDate = false;
	if (endDate == undefined) {
		maxDate = new Date();
	} else {
		maxDate = moment(endDate).isValid() ? endDate : false;
	}

	var defaultOptions = {
		format : 'YYYY',
		viewMode : 'years',
		maxDate : maxDate,
		dayViewHeaderFormat : 'YYYY',
		locale : 'zh-cn',
		ignoreReadonly : true,
		showClear:true,
	};
	$('#' + divId).datetimepicker(
			$.extend({}, defaultOptions, options ? options : {}));
};

common.month = function(divId, endDate, options) {
	var maxDate = false;
	if (endDate == undefined) {
		maxDate = new Date();
	} else {
		maxDate = moment(endDate).isValid() ? endDate : false;
	}

	var defaultOptions = {
		format : 'YYYY-MM',
		viewMode : 'months',
		maxDate : maxDate,
		dayViewHeaderFormat : 'YYYY-MM',
		locale : 'zh-cn',
		ignoreReadonly : true,
		showClear:true,
	};
	$('#' + divId).datetimepicker(
			$.extend({}, defaultOptions, options ? options : {}));
};

/**
 * 日期（年月日） divId 日期字段 endDate:日期控件能选的最迟时间,默认是今天 startDate：日期控件能选的最早时间,默认不限制
 */

common.date = function(divId,endDate,startDate,options) {
	var maxDate = false;
	if (endDate == undefined) {
		maxDate = new Date();
	} else if (endDate == '' || !endDate) {
		maxDate = false;
	} else {
		maxDate = moment(endDate).isValid() ? endDate : false;
	}
	var minDate = false;
	if (startDate == undefined || !startDate) {
		minDate = false;
	} else {
		minDate = moment(startDate).isValid() ?moment(startDate).format('L') : false;
	}

	var defaultOptions = {
		format : 'YYYY-MM-DD',
		viewMode : 'days',
		maxDate : maxDate,
		minDate : minDate,
		dayViewHeaderFormat : 'YYYY年MMMD日',
		locale : 'zh-cn',
		ignoreReadonly : true,
		
		showClear:true,
		//debug:true,
		useCurrent:false,
	};
	
	$('#' + divId).datetimepicker(
			$.extend({}, defaultOptions, options ? options : {}));
};

/**
 * 删除日期事件
 */
common.removeDate = function(divId) {
	if ($('#' + divId).length && !!$('#' + divId).data('DateTimePicker')) {
		$('#' + divId).data('DateTimePicker').destroy();
	}
};
/**
 * 时间 年月日时分秒
 */
common.datetime = function(divId, endDate, startDate, options) {
	var maxDate = false;
	if (endDate == undefined) {
		maxDate = new Date();
	} else {
		maxDate = moment(endDate).isValid() ? endDate : false;
	}
	var minDate = moment(startDate).isValid() ? startDate : false;

	var defaultOptions = {
		format : 'YYYY-MM-DD HH:mm:ss',
		viewMode : 'days',
		showTodayButton : true,
		maxDate : maxDate,
		minDate : minDate,
		sideBySide : true,
		dayViewHeaderFormat : 'YYYY年MMMD日',
		locale : 'zh-cn',
		ignoreReadonly : true,
		showClear:true,
		
	};

	$('#' + divId).datetimepicker(
			$.extend({}, defaultOptions, options ? options : {}));
};


/**
 * 根据tab code获取另一个iframe，调用获得的iframe中的方法如下 如：common.getTab('main').test();
 */
common.getTab = function(tabCode) {
	return $(top.document).contents().find("#i-" + tabCode)[0].contentWindow;
};


common.getTab1 = function(tabCode) {
	if($(top.document).contents().find("#i-" + tabCode).length){
		return $(top.document).contents().find("#i-" + tabCode)[0].contentWindow;
	}else{
		return null;
	}
};
/**
 * 关闭指定tab
 */
common.closeTab = function(tabCode) {
	top.closeTab(tabCode);
};

/**
 * 根据select的pCode属性，动态添加option
 * pCode为所需参数的code，同时需要在select的class中增加fillSelect属性，如果要设置默认选中项，则需要把选中项的value值放在select的value属性中
 * 如：<select id="customerType" name="customerType" class="form-control
 * fillSelect" pCode="customerType" value="01">
 */
common.fillAllSelect = function() {
	var parameterCodes = new Array();
	$('select.fillSelect').each(
			function() {
				var pCode = $(this).attr('pCode');
				if(pCode == undefined){
					return;
				}
				var value = $(this).attr('value');
				if (top.parameters[pCode]) {
					var options = top.parameters[pCode];
					for ( var i = 0; i < options.length; i++) {
						var option = options[i];
						$(this).append(
								"<option value='"
										+ option.value
										+ "' "
										+ (value == option.value ? 'selected'
												: '') + " >" + option.name
										+ "</option>");
					}
				} else {
					parameterCodes.push(pCode);
				}
			});
	if (parameterCodes.length > 0) {
		$
				.ajax({
					type : "post",
					url : rcContextPath + '/base/getParameters',
					data : {
						'parameters' : parameterCodes.join(',')
					},
					loading:false,
					success : function(data) {
						$('.fillSelect')
								.each(
										function() {
											var pCode = $(this).attr('pCode');
											var value = $(this).attr('value');
											var options = data[pCode];
											if (options && options.length > 0) {
												var optionArray = new Array();
												for ( var i = 0; i < options.length; i++) {
													var option = options[i];
													$(this)
															.append(
																	"<option value='"
																			+ option.value
																			+ "' "
																			+ (value == option.value ? 'selected'
																					: '')
																			+ " >"
																			+ option.name
																			+ "</option>");
													var newOption = {};
													newOption.name = option.name;
													newOption.value = option.value;
													optionArray.push(newOption);
												}
												top.parameters[pCode] = optionArray;
											}
										});
					}
				});
	}
};


common.fillAllCheckbox = function(parame,callBackSome) {
	var parameterCodes = new Array();
	$('.fillCheckbox').each(
			function() {
				var pCode = $(this).attr('pCode');
				var value = $("#checboxValue").val();
				if (top.parameters[pCode]) {
					var options = top.parameters[pCode];
					for ( var i = 0; i < options.length; i++) {
						var option = options[i];
						$(this).append(
								"<input style='vertical-align:middle;margin-top:-2px' type='checkbox' name='"+parame+"' value='"
										+ option.value
										+ "'"
										+ (value.indexOf(option.value)>-1 ? ' checked=checked'
												: '') + " >&nbsp;" + option.name
										+ "</input>&nbsp;&nbsp;");
					}
				} else {
					parameterCodes.push(pCode);
				}
			});
	if (parameterCodes.length > 0) {
		$
				.ajax({
					type : "post",
					url : rcContextPath + '/base/getParameters',
					data : {
						'parameters' : parameterCodes.join(',')
					},
					loading:false,
					success : function(data) {
						$('.fillCheckbox')
								.each(
										function() {
											var pCode = $(this).attr('pCode');
											var value = $("#checboxValue").val();
											var options = data[pCode];
											if (options && options.length > 0) {
												var optionArray = new Array();
												for ( var i = 0; i < options.length; i++) {
													var option = options[i];
													$(this)
															.append(
																	"<input style='vertical-align:middle;margin-top:-2px' type='checkbox' name='"+parame+"' value='"
																	+ option.value
																	+ "'"
																	+ (value.indexOf(option.value)>-1 ? ' checked=checked'
																			: '') + " >&nbsp;" + option.name
																	+ "</input>&nbsp;&nbsp;");
													var newOption = {};
													newOption.name = option.name;
													newOption.value = option.value;
													optionArray.push(newOption);
												}
												top.parameters[pCode] = optionArray;
											}
										});
						//回调方法
						callBackSome();
					}
				});
	}
};

/**
 * 将参数value 翻译成参数名称 需要 class="fillText" 和pCode属性
 */
common.fillText = function() {
	var parameterCodes = new Array();
	$('.fillText').each(function() {
		var pCode = $(this).attr('pCode');
		if (!top.parameters[pCode]) {
			parameterCodes.push(pCode);
		}
	});

	$('.fillText').each(function() {
		var pCode = $(this).attr('pCode');
		var value = $(this).html();
		var obj = this;
		common.initParameters(parameterCodes, function() {
			var pName = common.getLableFromValue(pCode, value);
			$(obj).html(pName);
		});
	});

};

/**
 * 将参数value 翻译成参数名称 需要 class="fillValue" 和pCode属性 适用于input 类型
 */
common.fillValue = function() {
	var parameterCodes = new Array();
	$('.fillValue').each(function() {
		var pCode = $(this).attr('pCode');
		if (!top.parameters[pCode]) {
			parameterCodes.push(pCode);
		}
	});

	$('.fillValue').each(function() {
		var pCode = $(this).attr('pCode');
		var value = $(this).val();
		var obj = this;
		common.initParameters(parameterCodes, function() {
			var pName = common.getLableFromValue(pCode, value);
			$(obj).val(pName);
		});
	});

};

/**
 * 根据value获得对应参数的文本：只查询top，不存在的返回空 为避免空，使用此方法时，先调用initParameters
 */
common.getLableFromValue = function(pCode, value) {
	var lable = "";
	if (top.parameters[pCode]) {
		var options = top.parameters[pCode];
		for ( var i = 0; i < options.length; i++) {
			if (value == options[i].value) {
				lable = options[i].name;
				break;
			}
			;
		}
	} else {
		common.info("未发现" + pCode + "，请确认配置正确，并已经在使用前通过initParameters初始化");
	}
	return lable;
};

/**
 * 直接获取真实值，top中不存在会自动发起一个同步的请求获取 （此函数暂时没有使用场景）
 */
common.getRealLableByValue = function(pCode, value) {
	if (!top.parameters[pCode]) {// 发起同步请求
		common.initParameters(pCode, function() {
		}, true);
	}
	return common.getLableFromValue(pCode, value);
};

/**
 * 根据form初始化select
 * 
 */
common.fillFormSelect = function(formId) {
	var parameterCodes = new Array();

	// form下的所有select框，为了查询一次数据库
	$('#' + formId + ' .fillSelect').each(function() {
		var pCode = $(this).attr('pCode');
		if (!top.parameters[pCode]) {
			parameterCodes.push(pCode);
		}
	});

	$('#' + formId + ' .fillSelect').each(function() {
		var pCode = $(this).attr('pCode');
		var obj = this;
		common.initParameters(parameterCodes, function() {
			common.fillSelect(obj, pCode);
		});
	});
};

/**
 * 根据selectId 初始化下拉列表 fieldId 选择框的ID pCode 参数代码 func
 * 要执行的函数，一般是联动的时候需要此函数，保证上级下拉框初始化以后，初始化下级
 */

common.fillSelectById = function(fieldId, pCode, func) {

	common.initParameters(pCode, function() {
		common.fillSelect($("#" + fieldId), pCode);
		if ($.isFunction(func)) {
			func.call();
		}
	});
};

common.fillSelectByObj = function(obj, pCode, func) {

	common.initParameters(pCode, function() {
		common.fillSelect($(obj), pCode);
		if ($.isFunction(func)) {
			func.call();
		}
	});
};

/**
 * 
 */

common.fillSelectByPValue = function(fieldId, pCodeId, pValue, func) {

	$.ajax({
		type : "post",
		url : rcContextPath + '/option/getSubOptionList',
		data : {
			'pCodeId' : pCodeId,
			'pValue' : pValue
		},
		success : function(data) {

			var options = data;
			var value = $("#" + fieldId).attr('value');
			for ( var i = 0; i < options.length; i++) {
				var option = options[i];
				$("#" + fieldId).append(
						"<option value='" + option.value + "' "
								+ (value == option.value ? 'selected' : '')
								+ " >" + option.name + "</option>");
			}
			if ($.isFunction(func)) {
				func.call();
			}
		}
	});

};

/**
 * 填充下拉列表
 */
common.fillSelect = function(obj, pCode) {
	var options = top.parameters[pCode];
	var value = $(obj).attr('value');
	for ( var i = 0; i < options.length; i++) {
		var option = options[i];
		$(obj).append(
				"<option value='" + option.value + "' "
						+ (value == option.value ? 'selected' : '') + " >"
						+ option.name + "</option>");
	}
};

/**
 * 初始化页面用到的参数 pCodes 格式1为pCode1, pCode2, pCode3 格式2为[pCode1,pCode2,pCode3] fn
 * 回调函数，执行所有需要使用参数的语句 syncFlag 同步标志，不传或者为false意思是异步，传true标志为同步
 */
common.initParameters = function(pCodes, fn, syncFlag) {
	var newCodes = new Array();
	var codes;
	if ($.type(pCodes) == 'array') {
		codes = pCodes;
	} else {
		codes = pCodes.split(",");
	}
	for ( var j = 0; j < codes.length; j++) {
		if (!top.parameters[codes[j]]) {
			newCodes.push(codes[j]);
		}
	}

	var isAsync = true;// 默认是异步
	if ((syncFlag != undefined) && (syncFlag == true))// 传了同步标志位true，才是同步
	{
		isAsync = false;
	}

	if (newCodes.length > 0) {
		$.ajax({
			async : isAsync,
			type : "post",
			url : rcContextPath + '/base/getParameters',
			data : {
				'parameters' : newCodes.join(",")
			},
			loading:false,
			success : function(data) {
				for ( var j = 0; j < codes.length; j++) {
					var options = data[codes[j]];
					if (options && options.length > 0) {
						var optionArray = new Array();
						for ( var i = 0; i < options.length; i++) {
							var option = options[i];
							var newOption = {};
							newOption.name = option.name;
							newOption.value = option.value;
							optionArray.push(newOption);
						}
						top.parameters[codes[j]] = optionArray;
					}
				}
				if ($.isFunction(fn)) {
					fn.call();
				}
			}
		});
	} else {
		if ($.isFunction(fn)) {
			fn.call();
		}
	}
};

//上传文件的类型判断,先判断systemExtArray是否定义，因为存在不引用headMaro的页面，可能未定义，给个默认值
//文件类型主要从数据库的itemConfig中取，这里只是个补丁
if( (typeof systemExtArray)=="undefined"){
	common.extArray = new Array("png","jpg","jpeg","bmp","gif","tif","tiff","wmv","swf","avi","mp4","rmvb","rm","3gp","amv","mpeg4","txt","doc","docx","xls","xlsm","xlsx","et","csv","ppt","pptx","dps","zip","rar","7z","html","htm","pdf","mdi","dat","msg","jp2","j2k","jpc");
}else{
	common.extArray = systemExtArray;
}

/**
 * 判断指定元素之内的所有选择文件的后缀名是否合法
 */
common.checkFileExt = function(objId) {
	var files = $("#" + objId).find("input[type=file]");

	var result = true;
	files.each(function() {
		//排除multiple的多文件选择框
		if($(this).attr('multiple') === 'multiple' || $(this).hasClass('webuploader-element-invisible')){
			return;
		};
		var ext = $(this).val().substring($(this).val().lastIndexOf(".") + 1,
				$(this).val().length);
		if (!ext) {
			result = false;
			return false;
		} else if ($.inArray(ext.toLowerCase(), common.extArray) < 0) {
			result = false;
			return false;
		}
	});
	if (!result) {
		common.info("关联文档中每一行都要上传文档，并且本系统只允许上传  " + common.extArray.join("、")
				+ " 格式的文件");
	}
	return result;
};


/**
 * 导入浏览上传时候校验文件后缀、大小
 */
common.checkImportFileTypeSize = function(importInputId){

	var fileUpload = $("#"+importInputId);	
	var path=$("#"+importInputId).val();  //C:\Documents and Settings\hud\桌面\AddFile.jpg
    var allName=path.split('\\'); 
    var fname=allName[allName.length-1];
    
    //以下如调整顺序，需注意

	//后缀名  合法性判断，默认合法
	var extNameResult=true;
	var extArray = new Array("xls", "xlsx" ,"xlsm");
	var ext = fname.substring(fname.lastIndexOf(".") + 1,fname.length);
	if (!ext) {
		extNameResult = false;
	} else if ($.inArray(ext.toLowerCase(), extArray) < 0) {
		extNameResult = false;
	}
 	if (!extNameResult) {
 		common.info("本系统只允许导入  " + extArray.join("、")
 				+ " 格式的文件");
 		fileUpload.after(fileupload.clone().val("")); 
 		fileUpload.remove();
		return;
 	}
 	
    //校验大小
 	if(!common.checkFileSize(fileUpload)){
 		fileupload.after(fileUpload.clone().val("")); 
		fileupload.remove();
		return;
	}
     
};


/**
 * 验证上传文件的大小 类型
 * @param fileUpload
 */
common.checkFileSize=function(fileUpload){
	//文件 对象
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var fileSize = 0;
	try{
			if (isIE && !fileUpload[0].files) { // IE浏览器
	            var filePath = fileUpload[0].value; // 获得上传文件的绝对路径
	            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
	            // GetFile(path) 方法从磁盘获取一个文件并返回。
	            var file = fileSystem.GetFile(filePath);
	            fileSize = file.Size; // 文件大小，单位：b
	        }else {    // 非IE浏览器
	            fileSize = fileUpload[0].files[0].size;
	        }
	        var size = fileSize / 1024 / 1024;
	        if(size.toFixed(10)>parseInt(parent.uploadFileSize)){
		    	 common.info("文件大于"+parent.uploadFileSize+"M,请重新上传。");
		    	 return false;
		    }	
	 }catch(e){
	        common.info("请使用IE、FireFox、Chrome浏览器，如果浏览器是IE，请将“对未标记为可安全执行脚本的ActiveX控制初始化并执行脚本（不安全）”设置为 “启用（不安全）”");
		 //有些IE按上述仍然是无法判断大小，所以后端不管浏览器判断与否都在后端判断大小
	        return false;
	 }  
	return true;
};

//所有链接判断是否可以编辑权限打开
common.validateEdit = function(ownerId, ownerDepartmentId) {
	if (currentUserId != ownerId
			&& $.inArray(ownerDepartmentId,curUserManagedOrganIds.split(",")) == -1) {
		return false;
	}
	return true;
};
/**
 * gridId:列表ID operateType:操作类型，edit为编辑，delete为删除
 */
common.validateOwner = function(gridId, operateType) {
	var rowscontent = $("#" + gridId).bootgrid("getSelectedRowsContent");
	var result = true;
	for ( var i = 0; i < rowscontent.length; i++) {
		// 负责人Id
		var ownerId = rowscontent[i].ownerId;
		var ownerDepartmentId = rowscontent[i].ownerDepartmentId;
		
		// 13627
		if (operateType == 'edit' || operateType == 'delete') {
			if (currentUserId != ownerId
					&& $.inArray(ownerDepartmentId,curUserManagedOrganIds.split(",")) == -1) {
				result = false;
				if (operateType == 'edit') {
					common.info("不允许编辑不属于本人、本部门或本人管理部门的数据");
				} else if (operateType == 'delete') {
					common.info("不允许删除不属于本人、本部门或本人管理部门的数据");
				}
				break;
			}
		} else {
			if (currentUserId != ownerId) {
				result = false;
				if (operateType == 'share') {
					common.info("不允许共享不属于本人的数据");
				} else if (operateType == 'send') {
					common.info("不允许分派不属于本人的数据");
				} else if (operateType == 'transfer') {
					common.info("不允许转化不属于本人的数据");
				}
				break;
			}
		}

	}
	return result;
};

/**
 * 分派请求页面 gridId：列表ID modelId：HOME页面中模态窗口的ID fn：绑定模态窗口 确定函数
 */

common.assignOwnerReq = function(gridId, modelId, fn) {
	var ids = $("#" + gridId).bootgrid("getSelectedRows");
	var rowscontent = $("#" + gridId).bootgrid("getSelectedRowsContent");

	if (ids <= 0) {
		common.info('请选择记录!');
		return;
	}
	for ( var i = 0; i < rowscontent.length; i++) {
		// 负责人Id
		var ownerId = rowscontent[i].ownerId;
		if (currentUserId != ownerId) {
			common.info("当前用户不是此实体的负责人,不能分派或共享");
			return;
		}
	}
	$.ajax({
		type : "post",
		url : rcContextPath + '/base/assignOwnerReq',
		data : '',
		success : function(data) {
			$('#' + modelId).html(data);
			var url = rcContextPath + "/user/queryUser";
			$("#assignOwnerGrid").bootgrid({
				queryForm : "assignOwnerForm",
				ajax : true,
				post : function() {
				},
				url : url,
				selection: true, 
                    rowSelect:true,
				multiSelect : true,
				formatters : {}
			});

			$('#' + modelId).modal('toggle');
			$('#assignBtn').off('click').on('click', fn);
		}
	});
};
/**
 * 共享请求页面 gridId：列表ID modelId：HOME页面中模态窗口的ID，entityName实体key fn：绑定模态窗口 确定函数
 */

common.shareOwnerReq = function(gridId,modelId,entityName,fn) {
	var ids = $("#" + gridId).bootgrid("getSelectedRows");
	var rowscontent = $("#" + gridId).bootgrid("getSelectedRowsContent");

	if (ids <= 0) {
		common.info('请选择记录!');
		return;
	}
	if(rowscontent.length!=1){
		common.info('每次只分享一条数据!');
		return;
	}
	for ( var i = 0; i < rowscontent.length; i++) {
		// 负责人Id
		var ownerId = rowscontent[i].ownerId;
		if (currentUserId != ownerId) {
			common.info("当前用户不是此实体的负责人,不能分派或共享");
			return;
		}
	}
	$.ajax({
		type : "post",
		url : rcContextPath + '/base/assignOwnerShare?businessModelId='+ids+"&modelName="+entityName,
		data : '',
		success : function(data) {
			$('#' + modelId).html(data);
			$('#' + modelId).modal('toggle');
			$('#assignBtn').off('click').on('click', fn);
		}
	});
};
/**
 * 分派响应页面
 * 
 */
common.assignOwnerRes = function(gridId, modelId, modelName) {
	var userIds = $("#assignOwnerGrid").bootgrid("getSelectedRows");
	var businessModelIds = $("#" + gridId).bootgrid("getSelectedRows");

	if (userIds.length <= 0) {
		common.info('请选择需要分派的记录。');
		return false;
	} else if (userIds.length > 1) {
		common.info('分派只能选择一条用户记录!');
		return false;
	} else {
		$.ajax({
			type : "post",
			url : rcContextPath + '/base/assignOwnerRes?userId=' + userIds
					+ '&businessModelIds=' + businessModelIds + '&modelName='
					+ modelName,
			data : '',
			success : function() {
				common.info('分派成功!');
				$("#" + gridId).bootgrid("search", "");
			}
		});
	}

	common.closeModelDialog(modelId);

};

common.shareOwnerRes = function(gridId, modelId, modelName) {
	var userIds = "";
	var len=$("#userSelectedNode option").length;
	$("#assignBtn").attr("disabled",true);
	if(len>=1){
		/*common.info('请添加共享人!'); 
		$("#assignBtn").removeAttr('disabled');
		return false;*/
    	$("#userSelectedNode option").each(function (i) {
    			if(i < len-1 ){
    				userIds = userIds+$(this).val()+",";
    			}else{
    				userIds = userIds+$(this).val();
    			}
    	});
	}
	var businessModelIds = $("#" + gridId).bootgrid("getSelectedRows");
	if (businessModelIds.length <= 0) {
		common.info('请选择需要共享的记录。');
		return false;
	} else {
		$.ajax({
			type : "post",
			url : rcContextPath + '/base/shareOwnerRes?userId=' + userIds
					+ '&businessModelIds=' + businessModelIds + '&modelName='
					+ modelName,
			data : '',
			success : function() {
				common.info('共享成功!');
				$("#" + gridId).bootgrid("search", "");
			}
		});
	}

	common.closeModelDialog(modelId);

};

common.queryOwnerAssign = function() {
	$("#assignOwnerGrid").bootgrid("search", "");
};

/**
 * 根据Id修改缩放Div的标注(加减号)
 */
common.changeSign = function(id) {
	var element = $('#' + id);
	if (element.hasClass('glyphicon-plus')) {
		element.removeClass('glyphicon-plus');
		element.addClass('glyphicon-minus');
	} else if (element.hasClass('glyphicon-minus')) {
		element.removeClass('glyphicon-minus');
		element.addClass('glyphicon-plus');
	}
};
/**
 * 根据Id修改缩放Div的标注(上、下号) glyphicon-chevron-up glyphicon-chevron-down
 * 同时将stepData的Div隐藏、显示
 */
common.changeSignUpDown = function(id,stepDataId) {
	var element = $('#' + id);
	var stepData = $('.' + stepDataId);
	if (element.hasClass('glyphicon-chevron-up')) {
		element.removeClass('glyphicon-chevron-up');
		element.addClass('glyphicon-chevron-down');
		stepData.hide();
	} else if (element.hasClass('glyphicon-chevron-down')) {
		element.removeClass('glyphicon-chevron-down');
		element.addClass('glyphicon-chevron-up');
		stepData.show();		
	}
};

$(function() {
	if ($('#formContent').attr('id')) {
		if($('#stageSign').length){
			$('#formContent').css("height", (top.iframeHeight - 35 - 13 -56) + "px");
		}else{
			$('#formContent').css("height", (top.iframeHeight - 35 - 13) + "px");
		}
		
	}
	/*if(window.ol) {
		loading = new ol.loading({cls:'container'});
	}*/
});

/**
 * 详情页面，根据formId让控件只读
 */
common.readOnlyForm = function(formId, noHideBtnId) {
	// 顶层按钮区隐藏
	$('.topBtns button').each(function() {// 或者#btns button
		var btnId = $(this).attr("id");
		if (btnId != noHideBtnId) {
			$(this).hide();
		}
	});
	// 阶段的上一步 下一步按钮隐藏 TODO 待老王看看下面的遍历为啥没有控制住阶段的按钮
//	$("#" + formId + " #leftBtn").hide();
//	$("#" + formId + " #rightBtn").hide();

	// input框:text只读，复选框置灰
	$('#' + formId + ' :input').each(function() {
		var tag = this.tagName.toLowerCase();// html的取法
		var type = this.type;
		if (type == "text") {// 相当于[type=text]
			$(this).attr("readonly", "readonly");
			$(this).attr("placeholder", "");
		}
		// 为了IE9下面 textarea能看到
		else if (tag == 'textarea') {
			$(this).attr("readonly", "readonly");
			$(this).attr("placeholder", "");
		}

		/*
		 * else if (tag == "button" || type == "button" || type =="file"){
		 * $(this).hide(); }
		 */else {
			$(this).attr("disabled", "disabled");
		}
	});

	// $('#'+formId+' :button').each(function() { 上文input能取到
	// $(this).hide();
	// });
	// $('#'+formId+' textarea').each(function() {上文input能取到
	// $(this).attr("readonly", "readonly");
	// $(this).attr("placeholder", "");
	// });
	$('#' + formId + ' select').each(function() {
		$(this).attr("disabled", "disabled");
	});

	$('#' + formId + ' li').each(function() {
		$(this).off();
	});

	// 详情页面 超链接不可操作
	// $('#'+formId+' a').each(function(){
	//		
	// $(this).removeAttr('href');
	// $(this).removeAttr('onclick');
	//		
	// $(this).css("text-decoration","none");
	// $(this).css("cursor","default");
	// });

};

// 定义加法函数,JS加法有浮点的BUG
common.accAdd = function(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
};

// 定义减法函数（解决JS减法有浮点的BUG）
common.accSub = function(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
};

// 定义乘法函数（解决JS乘法有浮点的BUG）
common.accMul = function(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
			/ Math.pow(10, m);
};

// 定义除法函数（解决JS除法有浮点的BUG）
common.accDiv = function(arg1, arg2) {
	var r1 = 0, r2 = 0, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
	}

	m = Number(arg1.toString().replace(".", ""));
	n = Number(arg2.toString().replace(".", ""));
	return (m / n) * Math.pow(10, r2 - r1);
};

// 报价通用验证规则，整数部分最多15位，小数部分最少9位
common.validateBillingNumber = function(number) {
	var integerNumber = common.getDecimalCount(number, 1);
	var decimalNumber = common.getDecimalCount(number, 2);
	if (integerNumber > 15 || decimalNumber > 2) {
		return false;
	} else {
		return true;
	}
};

//报价通用验证规则，整数部分最多15位，小数部分最少9位
common.validateBillingNumber4 = function(number) {
	var integerNumber = common.getDecimalCount(number, 1);
	var decimalNumber = common.getDecimalCount(number, 2);
	if (integerNumber > 15 || decimalNumber > 4) {
		return false;
	} else {
		return true;
	}
};


// 报价通用验证，整数位对多为多少位 digits 位数
common.validateBillingInteger = function(number, digits) {
	var integerNumber = common.getDecimalCount(number, 1);
	if (integerNumber > digits) {
		return false;
	} else {
		return true;
	}
};

// 报价单通用验证，小数位为多少位，digits 位数
common.validateBillingDecimal = function(number, digits) {
	var decimalNumber = common.getDecimalCount(number, 2);
	if (decimalNumber > digits) {
		return false;
	} else {
		return true;
	}
};

//用于计算租期频率的月化值
common.getMonthsByRentFrequency = function(rentFrequency){
	if(rentFrequency == "01"){
		return 1;
	}else if(rentFrequency == "02"){
		return 3;
	}else if(rentFrequency == "03"){
		return 6;
	}else if(rentFrequency == "04"){
		return 12;
	}else if(rentFrequency == ""){
		return 0;
	}
};

// 根据type分别取小数或者整数的位数：1、整数；2、小数
common.getDecimalCount = function(number, type) {
	var decimalOrNot = number.toString().indexOf(".");
	var integerCount;
	var decimalCount;
	if(decimalOrNot > 0){
		var integerDec = number.toString().split(".");
		integerCount = (integerDec[0]).length;
		decimalCount = (integerDec[1]).length;
	}else{
		integerCount = number.toString().length;
		decimalCount = 0;
	}
	if (type == 1) {
		return integerCount;
	} else if (type == 2) {
		return decimalCount;
	}
};
/** date 加天数*/
common.addDate = function(date, days) {
	var d = new Date(date);
	d.setDate(d.getDate() + days);
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	var val = d.getFullYear() + "" + month + "" + day;
	return val;
};
/** 判断时间先后顺序(不包括包含等于情况) 
 * 开始时间晚于结束时间返回false
 * 开始时间早于等于结束时间返回true
 * */
common.ckdate = function(endtime, starttime) {
	starttime=starttime.replace(new RegExp("-","gm"),"/");
	endtime=endtime.replace(new RegExp("-","gm"),"/");
	var endTime1 = new Date(Date.parse(endtime)); 
	var startTime1 = new Date(Date.parse(starttime)); 
	if (startTime1 > endTime1) {
		return false;
	} else {
		return true;
	}
};

/** 判断时间先后顺序(不包括包含等于情况) 
 * 开始时间晚于等于结束时间返回false
 * 开始时间早于结束时间返回true
 * */
common.ckdate2 = function(endtime, starttime) {
	starttime=starttime.replace(new RegExp("-","gm"),"/");
	endtime=endtime.replace(new RegExp("-","gm"),"/");
	var endTime1 = new Date(Date.parse(endtime)); 
	var startTime1 = new Date(Date.parse(starttime)); 
	if (startTime1 >= endTime1) {
		return false;
	} else {
		return true;
	}
};

// 显示/隐藏列表页面按钮
common.showButton = function() {
	$("#otherBtns").animate({
		width : "toggle"
	});
	$('#btnSign').blur();
	if ($('#btnSignImg').attr('src').indexOf("right") > 0) {
		$('#btnSignImg')
				.attr('src', rcContextPath + '/images/common/leftb.png');
	} else {
		$('#btnSignImg').attr('src',
				rcContextPath + '/images/common/rightb.png');
	}
};

/**
 * 滑动显示/隐藏区域
 */
common.showItem = function (itemId) {
	$("#" + itemId).animate({
		width : "toggle"
	});
};


/***
 * 组装关注实体所需要的各个属性
 */

common.getURLByEntityType = function(entityType,id){
	var attentionEntity=null;
	switch(entityType){
		 case 'PROJECT':
			var url=rcContextPath+'/project/projectForm?projectId='+id+'&flag=detail';
			var code ='projectDetail'+id;
			attentionEntity=  new AttentionEntity('attentionProject',url,code,'项目详情','tabs',true,false);
			break;
		 case 'POTENTIALCUSTOMER':
				var url=rcContextPath+'/poCustomer/poCustomerForm?id='+id+'&flag=detail';
				var code ='detailPoCustomer'+id;
				attentionEntity=  new AttentionEntity('attentionPoCustomer',url,code,'潜在客户详情','tabs',true,false);
				break;
		 case 'OPPORTUNITY':
				var url=rcContextPath+'/opportunity/opportunityForm?id='+id+'&flag=detail';
				var code ='detailOpportunity'+id;
				attentionEntity=  new AttentionEntity('attentionOpportunity',url,code,'商业机会详情','tabs',true,false);
				break;
		 case 'SUPPLIER':
				var url=rcContextPath+'/supplier/supplierForm?id='+id+'&flag=detail';
				var code ='detailSupplier'+id;
				attentionEntity=  new AttentionEntity('attentionSupplier',url,code,'供应商详情','tabs',true,false);
				break;
		 case 'LEASEHOLD':	
		    url=rcContextPath+'/leasehold/leaseholdForm?leaseholdId='+id+'&flag=detail';
		    var code ='leaseholdDetail'+id;
		    attentionEntity=  new AttentionEntity('attentionLeasehold',url,code,'租赁物详情','tabs',true,false);
		    break;
		 case 'CUSTOMER': 
		    var url=rcContextPath+'/customer/customerForm?customerId='+id+'&flag=detail';
		    var code ='customerDetail'+id;
		    attentionEntity=  new AttentionEntity('attentionCustomer',url,code,'客户详情','tabs',true,false);
		    break;
		 case 'CONTRACT': 
		    var url=rcContextPath+'/contract/attentionJump?flag=detail&id='+id;
		    var code ='contractDetail'+id;
		    attentionEntity=  new AttentionEntity('attentionContract',url,code,'合同详情','tabs',true,false);
		    break;
		 case 'COMPETITOR': 
			var url=rcContextPath+'/competitor/competitorForm?flag=detail&id='+id;
		    var code ='competitorDetail'+id;
			attentionEntity=  new AttentionEntity('attentionCompetitor',url,code,'竞争对手详情','tabs',true,false);
			break;
		 case 'AGENCY': 
			var url=rcContextPath+ '/agency/agencyForm?flag=detail&id='+ id;
			var code ='detailAgency'+id;
			attentionEntity=  new AttentionEntity('attentionAgency',url,code,'中介机构详情','tabs',true,false);
			break;
		 case 'CONTACT': 
			var url=rcContextPath+ '/contact/contactForm?flag=detail&id='+ id;
			var code ='detailContact'+id;
			attentionEntity=  new AttentionEntity('attentionContact',url,code,'联系人详情','tabs',true,false);
			break;
		 case 'SUBSIDIARY': 
			var url=rcContextPath+ '/subsidiary/subsidiaryForm?flag=detail&id='+ id;
		    var code ='detailSubsidiary'+id;
			attentionEntity=  new AttentionEntity('attentionSubsidiary',url,code,'出租人详情','tabs',true,false);
			break;
		 case 'FINANCIALSTATEMENT': 
			var url=rcContextPath+'/financial/financialStatement/financialStatementForm?flag=detail&id='+ id;
		    var code ='detailFinancialStatement'+id;
			attentionEntity=  new AttentionEntity('attentionFinancialStatement',url,code,'客户财报详情','tabs',true,false);
			break;
		 case 'BILLINGLIST':
			 	var url=rcContextPath+ '/billingList/billingForm?flag=detail&billingId='+ id;
			 	var code ='billingFormEdit'+id;
			    attentionEntity=  new AttentionEntity('attentionBilling',url,code,'报价单详情','tabs',true,false);
				break;
		 case 'MEETING': 
				var url=rcContextPath+ '/meetting/meettingForm?flag=detail&id='+ id;
				var code ='detailMeeting'+id;
				attentionEntity=  new AttentionEntity('attentionMeeting',url,code,'会议详情','tabs',true,false);
				break;
		 case 'TRADINGRIVALS':
			   var url=rcContextPath+ '/financing/tradingRivals/tradingRivalsForm?flag=detail&id=' + id;
			   var code='detailTradingRivals'+id;
			   attentionEntity=  new AttentionEntity('attentionTradingrivals',url,code,'交易对手详情','tabs',true,false);
			   break;
		 case 'TRADINGOPPORTUNITY':
			   var url=rcContextPath+ '/tradingOpportunity/tradingOpportunityForm?flag=detail&id=' + id;
			   var code='detailTradingOpportunity'+id;
			   attentionEntity=  new AttentionEntity('attentionTradingopportunity',url,code,'交易机会详情','tabs',true,false);
			   break;
		 case 'TRADE':
			   var url=rcContextPath+ '/financing/trade/tradeForm?flag=detail&id=' + id;
			   var code='detailTradingRivals'+id;
			   attentionEntity=  new AttentionEntity('attentionTrade',url,code,'交易详情','tabs',true,false);
			   break;
		 case 'FINANCINGCONTRACT':
			   var url=rcContextPath+ '/financingContract/form?flag=detail&id='+id;
			   var code='contractDetail'+id;
			   attentionEntity=  new AttentionEntity('attentionFinancingcontract',url,code,'融资合同详情','tabs',true,false);
			   break;
		 case 'WITHDRAWALSLIP':
				var url=rcContextPath+ '/withdrawalTool/withdrawalForm?flag=detail&wdId='+ id;
			 	var code ='withdrawalFormView'+id;
			    attentionEntity=  new AttentionEntity('attentionWithdrawalslip',url,code,'提款单详情','tabs',true,false);
				break;
		 case 'FINANCINGCONTACT'://融资-联系人
			   var url=rcContextPath+ '/financingContact/financingContactForm?flag=detail&id=' + id;
			   var code='detailFinancingContact'+id;
			   attentionEntity=  new AttentionEntity('attentionFinancingcontact',url,code,'联系人详情','tabs',true,false);
			   break;
		 case 'FINANCINGAGENCY'://融资-中介机构
			   var url=rcContextPath+ '/financingAgency/financingAgencyForm?flag=detail&id=' + id;
			   var code='detailFinancingAgency'+id;
			   attentionEntity=  new AttentionEntity('attentionFinancingagency',url,code,'中介机构详情','tabs',true,false);
			   break;
		 case 'FINANCINGSUBSIDIARY'://融资-借款人
			   var url=rcContextPath+ '/financingSubsidiary/financingSubsidiaryForm?flag=detail&id=' + id;
			   var code='detailFinancingSubsidiary'+id;
			   attentionEntity=  new AttentionEntity('attentionFinancingsubsidiary',url,code,'借款人详情','tabs',true,false);
			   break;
				
			
	}
	return attentionEntity;
};
/**
 * 定义一个关注实体的对象
 */
var AttentionEntity = function(attentionSpanId,url,code,title,tabId,closeable,showOnClick){
	this.attentionSpanId=attentionSpanId;
	this.url=url;
	this.code=code;
	this.title=title;
	this.tabId=tabId;
	this.closeable=closeable;
	this.showOnClick=showOnClick;
};


/**
 * 关注实体与取消关注实体
 */

common.attentionEntity = function(item, id,name,entityType){

	//已经关注了，再点击就是取消关注
	var operateType=$("i", $(item)).hasClass('attentioned');
	if(operateType){
		operateType='cancel';
	}else{
		operateType='attention';
	}
	$.ajax({
	   	   // async: false,//同步
           type:"post",
           url:rcContextPath+'/base/attentionEntity',
           data:{
        	    'entityId':id,
	        	'entityName':name,
	        	'entityType':entityType,
	        	'operateType':operateType,
           },
           dataType :  'json',
           success:function(data){
        	   top.attentionEntityJson = data;
        		$("i", $(item)).toggleClass('attentioned');
        		var attentionEntity =common.getURLByEntityType(entityType,id);
        		
        		if(attentionEntity == null){
        			return;
        		}
        		//判断关注还是取消关注
        		if(!$("i", $(item)).hasClass('attentioned')){
        			top.cancelAttentionEntity(attentionEntity.attentionSpanId,name);
        		}else{
        			top.attentionEntity(attentionEntity.attentionSpanId,name,attentionEntity.tabId, attentionEntity.title, attentionEntity.code, attentionEntity.url, attentionEntity.closeable,attentionEntity.showOnClick,entityType);
        		}
        		attentionEntity = null;
        		if(entityType == 'OPPORTUNITY') {
        			if(top.getActiveTabId() != 'main') {
        				common.getTab('main').refreshTable("trackingRecordTable");
        			} else {
        				refreshTable("trackingRecordTable");
        			}
        		}
            }
	  });
	
};

/**
 * 返回顶部
 */
function goToTop(divId) {
	var area;
	if(divId) {
		area = "#" + divId;
	} else if($('#formContent').attr('id')) {
		area = "#formContent";
	} else {
		area = "body,html";
	}
	var speed = 200;
	$(area).animate({ scrollTop: 0 }, speed);
};

/**
 * 收放查询区域
 */
common.slideSearchDiv = function() {
	$($(".form-horizontal")[0]).slideToggle('fast');
	if($("#slideBtn").hasClass('glyphicon-triangle-top')) {
		$("#slideBtn").removeClass('glyphicon-triangle-top');
		$("#slideBtn").addClass('glyphicon-triangle-bottom');
		$("#slideBtn").html('展开');
	} else if ($("#slideBtn").hasClass('glyphicon-triangle-bottom')){
		$("#slideBtn").removeClass('glyphicon-triangle-bottom');
		$("#slideBtn").addClass('glyphicon-triangle-top');
		$("#slideBtn").html('收起');
	}
};
common.slideSearchAdQueryDiv = function() {
	var $div = $("div.ad_query");
    $($div[0]).slideToggle('fast');
	if($("#otherBtn").hasClass('glyphicon-triangle-top')) {
		$("#otherBtn").removeClass('glyphicon-triangle-top');
		$("#otherBtn").addClass('glyphicon-triangle-bottom');

		// TODO 清空该div 中 的表单内容
		// $div.wrap("<form id='a_d'></form>");
		// document.getElementById("a_d").reset();
		// $div.unwrap();
	} else if ($("#otherBtn").hasClass('glyphicon-triangle-bottom')){
		$("#otherBtn").removeClass('glyphicon-triangle-bottom');
		$("#otherBtn").addClass('glyphicon-triangle-top');
	}
};


/**
 *关闭滚动条的DIV层。
 */
common.closepageloading=function(){
	var pageloadid =null;
	try{
		pageloadid = $('#pageloadingdiv');
	}catch(e){
		pageloadid =null;
	};
	if(pageloadid!=undefined && pageloadid !=null){
		pageloadid.css('display','none');
	}
	/*if(loading) {
		loading.hide();
	}*/
};
/**
 *打开滚动条的DIV层
 */
common.openpageloading=function(){
	var pageloadid =null;
	try{
		pageloadid = $('#pageloadingdiv');
	}catch(e){
		pageloadid =null;
	};
	if (pageloadid != undefined && pageloadid != null) {
		pageloadid.css('display','block');
	}
	if(loading) {
		loading.show();
	}
};

function refreshTable(tableId) {
	if(tableId) {
		$("#" + tableId).bootgrid("search","");
	}
}

/**
 * 金额按千位逗号分割
 * 
 * @character_set UTF-8
 * @author Jerry.li(hzjerry@gmail.com)
 * @version 1.2014.08.24.2143 Example <code> 
 *      alert($.formatMoney(1234.345, 2)); //=>1,234.35 
 *      alert($.formatMoney(-1234.345, 2)); //=>-1,234.35 
 *      alert($.unformatMoney("1,234.345")); //=>1234.345 
 *      alert($.unformatMoney("-1,234.345")); //=>-1234.345 
 *  </code>
 */

(function($) {
	$.extend({
		/**
		 * 数字千分位格式化
		 * 
		 * @public
		 * @param mixed
		 *            mVal 数值
		 * @param int
		 *            iAccuracy 小数位精度(默认为2)
		 * @return string
		 */
		formatMoney : function(mVal, iAccuracy) {
			var fTmp = 0.00;// 临时变量
			var iFra = 0;// 小数部分
			var iInt = 0;// 整数部分
			var aBuf = new Array(); // 输出缓存
			var bPositive = true; // 保存正负值标记(true:正数)
			/**
			 * 输出定长字符串，不够补0
			 * <li>闭包函数</li>
			 * 
			 * @param int
			 *            iVal 值
			 * @param int
			 *            iLen 输出的长度
			 */
			function funZero(iVal, iLen) {
				var sTmp = iVal.toString();
				var sBuf = new Array();
				for ( var i = 0, iLoop = iLen - sTmp.length; i < iLoop; i++)
					sBuf.push('0');
				sBuf.push(sTmp);
				return sBuf.join('');
			}
			;

			if (typeof (iAccuracy) === 'undefined')
				iAccuracy = 2;
			bPositive = (mVal >= 0);// 取出正负号
			fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);// 强制转换为绝对值数浮点
			// 所有内容用正数规则处理
			iInt = parseInt(fTmp); // 分离整数部分
			iFra = parseInt((fTmp - iInt) * Math.pow(10, iAccuracy) + 0.5); // 分离小数部分(四舍五入)

			do {
				aBuf.unshift(funZero(iInt % 1000, 3));
			} while ((iInt = parseInt(iInt / 1000)));
			aBuf[0] = parseInt(aBuf[0]).toString();// 最高段区去掉前导0
			return ((bPositive) ? '' : '-') + aBuf.join(',') + '.'
					+ ((0 === iFra) ? '00' : funZero(iFra, iAccuracy));
		},

		/**
		 * 将千分位格式的数字字符串转换为浮点数
		 * 
		 * @public
		 * @param string
		 *            sVal 数值字符串
		 * @return float
		 */
		unformatMoney : function(sVal) {
			var fTmp = parseFloat(sVal.toString().replace(/,/g, ''));
			return (isNaN(fTmp) ? 0 : fTmp);
		},
	});
})(jQuery);

/**
 * 根据合同ID展示合同明细
 * @param id
 */
common.detailByContractId  = function (id,cmFlag) {
	if(cmFlag){ //承租人合同
		top.addTab('tabs', '承租人合同详情', 'contractMemberDetail'+id, rcContextPath
			+ '/contractMember/contractMemberForm?flag=detail&id='+id, true);
	}else{
		$.ajax(
		{
			type:"post",
			url:rcContextPath+'/contract/getTypeById',
			data:{
				'id':id
			},
			dataType :  'json',
			success:function(data){
				if (data.status == "OK") {
					var url;
					var tabName = "合同详情" ;
					var code = "contractDetail"; //区分标识
					var type = "visitContract";
					switch(data.data.type)
					{
						case "LEASE_CONTRACT": //租赁合同
							url = '/contract/contractForm?flag=detail&id='+id;
							break;
						case "GUARANTEE_CONTRACT": //担保合同
							url = '/contract/guaranteeContractForm?flag=detail&id='+id;
							tabName = "担保合同详情";
							break;
						case "FINANCING_CONTRACT": //贷款合同
								url = '/financingContract/form?flag=detail&id='+id;
								tabName = "贷款合同详情";
								code = 'financingContractDetail';
								type="visitFinancingcontract";
							break;
						case "MANUFACTOR_CONTRACT": //厂商租赁合同
							url = '/contract/manufactorContractForm?flag=detail&id='+id;
							tabName = "厂商租赁合同详情";
							break;
						case "ASSETTRANSFER_CONTRACT": //资产转让合同
							url = '/assetsOverContract/assetsOverContractform?flag=detail&id='+id;
							code = "assetsOverContractDetail";
							tabName = "转让合同详情";
							type="visitFinancingcontract";
							break;
						default:
							url = '/contract/contractForm?flag=detail&id='+id;
						
					}
					top.addTab('tabs', tabName, code+id, rcContextPath
						+ url, true,false,type,data.data.name);
				}else{
					common.warning(data.data.message);
				}
			}
		}
	);
	}
};

/**
 * 根据租赁ID查询租赁物详情页面
 * @param id
 */
common.detailLeaseholdById = function (id,name) {
	top.addTab('tabs', '租赁物详情', 'leaseholdDetail'+id, rcContextPath+'/leasehold/leaseholdForm?leaseholdId='+id+'&flag=detail', true,undefined,'visitLeasehold',name);
};

/**
 * 查询列表页面，名称含有多个空格时，替换空格为'&nbsp;'否则在html页面只显示一个空格
 */
common.replaceName = function (name) {
	if(name!=null){
		var replaceNme=name.replace(/\s/g,'&nbsp;');
		return replaceNme;
	}else{
		return "";
	}
};

//导航目录初始化
common.sideCatalogInit=function(){
	
	$('.slide').css('display','');
	//页面点击事件
	$('#formContent').bind('click', function(){
		 if(!$('#sideCatalogBtn').hasClass('sideCatalogBtnDisable')){
  		   	$('#sideCatalogBtn').addClass('sideCatalogBtnDisable');
            $('#sideCatalog').css('display','none');
         }
	});
	//目录按钮显示切换
	$('#sideCatalogBtn').bind('click', function(){
        if($(this).hasClass('sideCatalogBtnDisable')){
            $(this).removeClass('sideCatalogBtnDisable');
            $('#sideCatalog').css('display','');
        }else{
            $(this).addClass('sideCatalogBtnDisable');
            $('#sideCatalog').css('display','none');
        }
    });
	//各个定位标题距离顶部的固定高度数组
	/*var heightArray=[];
	$("b.headline").each(function(){
		//console.info($(this).offset().top-240);
		heightArray.push($(this).offset().top-240);
	});
	var lineLength=$("b.headline").length-1;//标题个数
	//不用这种方法定位，高度值定位不准确，误差偏大
	$('#formContent').scroll(function(){
		for (var i=lineLength; i>=0; i--) {
			//console.info($(this).scrollTop());
			//alert(i+"------"+$("b.headline").eq(i).offset().top +"------"+$("b.headline").eq(i).height());
			//if ($(this).scrollTop() >=$("b.headline").eq(i).offset().top - $("b.headline").eq(i).height()) {
			if ($(this).scrollTop() >= (heightArray[i] - $("b.headline").eq(i).height())) {
				var index = i;
				$('#sideCatalog-catalog dl dd').eq(index).addClass('highlight').siblings('dd').removeClass('highlight');
				return false;
			} else {
				$('#sideCatalog-catalog dl dd').eq(0).addClass('highlight').siblings('dd').removeClass('highlight');
			}
		}
	});*/
};

//实体中目录导航栏切换--------div中添加onmouseover事件，移入该div时调用该方法切换箭头
common.addhighlight=function(index){
	$('#sideToolbar-item-0-'+index).addClass('highlight').siblings('dd').removeClass('highlight');
};

//把特殊字符转义成普通字符
common.html2Escape=function (sHtml) {
	 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
};

common.operativeLog=function(elem){
	var modalId=$(elem).attr('modalId');
	var gridId= $(elem).attr('grid');
	
	var orderIds = $("#"+gridId).bootgrid("getSelectedRows");
	
	if(orderIds.length==0){
		common.info('请选择要查看的记录');
		return false;
	}else if(orderIds.length>1){
		common.info("只能选择一条记录");
		return false;
	}
	
	if(modalId!=''){
		//弹出页面
		$.ajax({
			type : "post",
			url : rcContextPath + '/operativeLog/operativeLogListPage?orderId='+orderIds, 
			data :'',
			success : function(data) {
				$('#'+modalId).html(data);
				$('#'+modalId).modal('toggle');
			}
		});
	}
};

common.ruleModal = function(data){
	var ruleModal=$('body').find("#riskController");
	if(ruleModal.length>0){
		
		common.closeModelDialog("riskController");
		$('body').find("#riskController").remove();
		
		var modal_backdrop=$(".modal-backdrop");
		for(var i=0;i<modal_backdrop.length;i++){
			$(modal_backdrop[i]).remove();
		}
		
	}
	if((data.content!=''&&data.content!=undefined)){
		  $('body').append(data.content);
		  $("#riskController").modal({backdrop:false});
		  
		  common.ruleBindClick(data.canForce);
		  
		  return true;
	  }else if((data.data!=null&&data.data.content!=''&&data.data.content!=undefined)){
		  $('body').append(data.data.content);
		  $("#riskController").modal('show');
		  
		  common.ruleBindClick(data.data.canForce);
		  return true;
	  }
	
	return false;
};
common.ruleBindClick = function(canForce){
	if(canForce == 'true'){
		  $("#continueSubmit").off('click').on('click',function(){
			  eval($("#buttonId").val()+"('1')");
		  });
	  }else{
		  $("#continueSubmit").attr('disabled','disabled');
	  }
};

common.closeRuleModel = function(){
	common.closeModelDialog("riskController");
	$('body').find("#riskController").remove();
};

common.applyRule=function(key,objId,fun){
	$.ajax({
        type : "post",
        url :rcContextPath+"/processRule/validateBeforeApply",
        data:{key:key.split("_")[0],objId:objId},//报价单版本ID
        success : function(data) {
        	if(data.success=="true"){
        		fun();
        	}
        	if(common.ruleModal(data)){
        		$("#continueSubmit").off('click');
        		$("#continueSubmit").on('click',function(){
        			fun();
        			$("#riskController").modal('hide');
        		});
	    		  return ;
        	}
        }
	});
};


//返回带提示信息的结果值
common.resultTip=function(value){
	if(value==null||value==""){
		return "";
	}else{
		return "<span title='"+value+"'>"+value+"</span>";
	}
};

//移除验证
common.removeValidate=function(filedName) {
    var obj = $('[name="' + filedName + '"]');
    if (obj) {
        var parentObj = obj.parents("div").attr("class");
        if (parentObj && parentObj.length > 0 && parentObj.indexOf("validateDiv") >= 0) {
            obj.parent("div").removeAttr("class").attr("class", "validateDiv");
            $('i[data-bv-icon-for="' + filedName + '"]').remove();
            $('small[data-bv-for="' + filedName + '"]').remove();
        }
    }
}

//根据用户登录名，展示用户名
common.getUserByName=function(userName) {
	var name;
	$.ajax({
		type : "post",
		async:	false,
		url : rcContextPath + '/user/getUserByName',
		data : {'userName' : userName},
		success : function(data) {
			name= data.name;
		}
	});
	return name;
}

/**
 * 根据指定时间增加月份
 */
common.getDate=function(date,number){
	var dateformat = common.strtodateformat(date);
	var currentYear = dateformat.getFullYear();
	var currentMonth = dateformat.getMonth()+1;
	//var lastMonth = dateformat.getMonth();
	var currentDate = dateformat.getDate();
	var prevCurrentYear = 0;
	var prevCurrentMonth = 0;
//	alert("currentMonth=====:"+currentMonth);
	if(currentMonth==0){
		prevCurrentYear = currentYear+number;
		prevCurrentMonth = 12;
	}else{
		if(currentMonth==12){
			prevCurrentYear = currentYear+1;
			var month = currentMonth+number;
			if(month>12){
				prevCurrentMonth = number;
			}else{
				prevCurrentMonth = month;
			}
			
		}else{
			var month = currentMonth+number;
			if(month>12){
				prevCurrentYear = currentYear+1;
				prevCurrentMonth = currentMonth;
			}else{
				prevCurrentYear = currentYear;
				prevCurrentMonth = currentMonth+number;
			}
		}
		
	}
	var lastmonth = prevCurrentYear+"-"+common.formatNumber(prevCurrentMonth)+"-"+common.formatNumber(currentDate);
	return lastmonth;
	
}

/**
 * 字符串转日期格式化成国际标准日期
 */
common.strtodateformat=function(strDate){
	var date = eval('new Date('+strDate.replace(/\d+(?=-[^-]+$)/,function(a){
		return parseInt(a,10)-1;
	}).match(/\d+/g)+')');
	return date;
}



/**
 * 根据当前时间增加天数或减少天数
 * dayNumber 增加或减少的天数
 * date 当前时间
 * pdVal 增加或减少标识  1：增加 -1 减少  0 不增不减
 * formatStr  输出格式
 */
common.dayNumber=function(dayNumber, date, pdVal){
	var newDate;
    date = date ? date : new Date(); 
    var ms = dayNumber * (1000 * 60 * 60 * 24);
    var str = new Date(date).getTime();
    if(pdVal==1){
    	newDate = new Date(str + ms); 
    }else if (pdVal == -1) {
    	newDate = new Date(str - ms); 
    }else{
    	newDate = new Date(str); 
    }
    var dateStr = common.formatDate(newDate);
    return dateStr; 
}

//处理个位数
common.formatNumber=function(s){
	return s<10?'0'+s:s;
};

//国际标准时间格式化成：yyyy-mm-dd
common.formatDate=function(date){
	var datetime = date.getFullYear()+'-'+((date.getMonth()+1)>10?(date.getMonth()+1):"0"+(date.getMonth()+1))+'-'+(date.getDate()<10?"0"+date.getDate():date.getDate());
	return datetime;
};
/**
 * 判断是否有权限集合permissions可以是一个，也可以是多个字符串，多个时用逗号分开；
 */
common.isHasPermissions=function(permissions){
	if(common.isEmpty (permissions)){
		return false;
	}
	var allPermission=window.parent.document.getElementById ("permissions").value;
	var permissArr=permissions.split(",");
	for(var i=0;i<permissArr.length;i++){
		if(allPermission.indexOf(permissArr[i])<0){
			return false;
		}
	}
	return true;
};

common.validateMoneyValue = function(number) {
	var integerNumber = common.getDecimalCount(number, 1);
	var decimalNumber = common.getDecimalCount(number, 2);
	if (integerNumber > 15 || decimalNumber > 2) {
		return false;
	} else {
		return true;
	}
};

