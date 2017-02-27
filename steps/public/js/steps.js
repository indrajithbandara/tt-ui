/*
=====================================
  Steps.js
  author: TT (ttghost@126.com)
=====================================
 */

;(function(g){
  function Steps(data){
    this.version = '0.2';
    this.data = data;
  }
  /**
   * get single item DOM string
   * @method function
   * @param  {Object} arg     type of item
   * @return {String}         item DOM string
   * @example
   *
   * arg = {
   *   text:'step-1',
   *   class: 'after',
   *   active: true, // optional , default value is false
   *   url: 'http://www.google.com' // optional
   * }
   */
  function getItemStr(arg, length){
    var active = arg.active ? 'active' : ''
    var length = length ? length : 1;
    var hrefAtrr = arg.url ? ' href="'+ arg.url +'"' : '';
    var itemString = '<li class="step ' + active + '" style="width:' + 100/length + '%"><div class="step-inner">' +
                      '<a class="point ' + arg.class + '"' + hrefAtrr + '></a>' +
                      '<div class="info">' + arg.text + '</div>' +
                    '</div></li>';
    return itemString;
  }
  /**
   * generate HTMLElement
   * @method function
   * @param  {Array} data     for get dom element data
   * @return {Object}         HTMLElement
   */
  function getElement(data){
    var steps = document.createElement('div');
    steps.setAttribute('class', 'steps');
    var data = data || [];
    var ul = '<ul>';
    var length = data.length;
    for(var i = 0; i < length; i++){
      ul += getItemStr(data[i], length);
    }
    ul += '</ul>';
    steps.innerHTML = ul;
    return steps;
  }
  Steps.prototype = {
    instance: null, // getElement.call(Steps,this.data),
    getDom: function(){
      return Steps.prototype.instance = getElement(this.data)
    },
    click: function(callback){
      var steps = Steps.prototype.instance;
      var points = steps.querySelectorAll('.point');
      if(steps){
        steps.addEventListener('click', function(e){
          var target = e.target;
          if (target && target.className.split(' ').indexOf('point') > -1) {
            var index = Array.prototype.indexOf.call(points, e.target);
            callback.call(this, e, index);
          }
        }, false);
      }
    }
  };
  window.Steps = Steps;
})(window);
