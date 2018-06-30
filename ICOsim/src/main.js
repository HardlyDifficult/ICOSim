// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueParticles from 'vue-particles'
import VueAnime from 'vue-animejs';
require('./main.css');

Vue.config.productionTip = false;

Vue.use(VueAnime);
Vue.use(VueParticles);

// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, decimals, trim_zeros) => 
{
  if(x == null)
  {
    return null;
  }
    if(decimals == null)
    {
        decimals = 0;
    }
    let parts = new BigNumber(x).toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(parts.length > 1 && trim_zeros)
    {
      let i;
      for(i = parts[1].length - 1; i >= 0; i--)
      {
        if(parts[1][i] != '0')
        {
          break;
        }
      }
      i++;
      parts[1] = parts[1].substring(0, i);
    }
    return parts.join(".");
}

const token_denominator = new BigNumber(1000000000000000000);

function formatCoins(number, digits, unit, trim_zeros) 
{
    if(!unit)
    {
        unit = "nas";
    }
    if(!digits)
    {
        digits = 8;
    }
    let x = new BigNumber(number).div(token_denominator);
    return numberWithCommas(x, digits, trim_zeros) + " " + unit;
}

Vue.filter('count', function (value) {
  return numberWithCommas(value);
});
Vue.filter('date', function (value) {
  return new Date(value).toString();
});
Vue.filter('percent', function (value) {
  return numberWithCommas(value) + "%";
});
Vue.filter('decimal', function (value) {
  return numberWithCommas(value, 4);
});
Vue.filter('resources', function (value) {
  if(!(value instanceof BigNumber))
  {
    throw new Error("Error!  This should be using a BigNumber");
  }
  return numberWithCommas(value, 2);
});
Vue.filter('resourcesApprox', function (value) {
  if(!(value instanceof BigNumber))
  {
    throw new Error("Error!  This should be using a BigNumber");
  }

  if(value.lt(1000))
  {
    return numberWithCommas(value, 2);
  }
  else if(value.lt(100000))
  {
    return numberWithCommas(value, 0);
  }
  else if(value.lt(1000000000))
  {
    value = value.div(1000);
    return numberWithCommas(value, 0) + "k";
  }
  else if(value.lt(1000000000000))
  {
    value = value.div(1000000);
    return numberWithCommas(value, 0) + "m";
  }
  else
  {
    value = value.div(1000000000);
    return numberWithCommas(value, 0) + "b";
  }

});
Vue.filter('nas', function (value) {
  return formatCoins(value, 12);
});
Vue.filter('nasApprox', function (value) {
  
  return formatCoins(value, 12, "NAS", true);
});
Vue.filter('nasComplete', function (value) {
  return formatCoins(value, 18);
});
Vue.filter('addr', function (value) {
  return value.substring(0, 4) + "..." + value.substring(value.length - 4);
});
Vue.filter('blocks_to_seconds', function (value) {
  return parseInt(value)*15;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});



  