// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueParticles from 'vue-particles'
import VueAnime from 'vue-animejs';
import VueI18n from 'vue-i18n';
require('./main.css');
import VueLocalStorage from 'vue-localstorage'

let s = require('./english.json');

Vue.config.productionTip = false;

Vue.use(VueLocalStorage)
Vue.use(VueAnime);
Vue.use(VueParticles);
Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
  en: {
    units:
    {
      per_s: "/s",
    },
    nav: {
      home: "Home",
      icos: "ICOs",
    },
    airdrops: {
      success: "Successfully claimed Airdrop!",
      airdrop_in_x_blocks: "Airdrop in: {count} blocks (~{block_time}s)",
      claim_worth: "Claim Airdrop worth",
      seconds: "seconds",
      blocks_remaining: "Blocks Remaining",
    },
    cmc: {
      icos: "ICOs",
      market_cap: "Market Cap",
      growth: "Growth",
      scammers: "Scammers",
      taken: "Taken",
      top_scammers: "Top Scammers By NAS Taken",
      top_icos: "Top ICOs By Market Capitalization",
      exit_value: "Exit Value", // pre exit
      exit_amount: "Exit Amount", // post exit
      tickers: "Ticker(s)",
      name: "Name",
      owner: "Owner",
    },
    details: {
      market_cap: "Market Cap",
      not_your_ico: "Not your ICO",
      launch_your_own: "Launch Your Own ICO",
      exit_scam: "Exit Scam",
      value: "Value",
      amount_taken: "Amount Taken",
      exit_scam_now: "EXIT SCAM NOW",
      about_exit: {
        title: "What's an Exit Scam?",
        p1: "100% of NAS spent is redistributed to players who \"Exit Scam\".  The value you may claim is determined by the ICOs market cap. So hype your ICO before you dump your bags.",
        p2: "The amount you can get when exit scamming may go down when others play.  Once you \"Exit Scam\" you may start over by launching a new ICO.",
        good_luck: "Good Luck",
      }
    },
    footer: {
      redistributed: "100% of NAS spent is redistributed to players who \"exit scam\"",
      created_by: "Created by",
      view_the: "View the",
      smart_contract: "Smart Contract",
      questions: "Questions, issues, or just want to hang out",
      join_our: "Join our",
      discord: "Discord",
      dont_spend_more_than: "Do not spend more than you are willing to lose",
    },
    launch: {
      welcome: "Welcome",
      intro: "Time to launch an ICO. Please check your morals at the door.",
      name: "Name",
      ticker: "Ticker",
      not_available: "Not Available",
      launch_ico: "Launch ICO",
      about: {
        title: "About ICOSim.io",
        p1: "Launch your own coin, meet milestones on your roadmap, hire the best shillers in the business, and finally, culminate all that worth into a lucrative exit scam. The path to your very own moon Lambo starts here",
        p2: "100% of NAS spent is redistributed to players who \"Exit Scam\".  The value you may claim is determined by the ICOs market cap. So hype your ICO before you dump your bags.",
        p3: "The amount you can get when exit scamming may go down when others play. Once you \"Exit Scam\" you may start over by launching a new ICO.",
        disclaimer: "May not prove profitable.  This is a game!  Do not spend more than you are willing to lose.",
        good_luck: "Good Luck!",
        open_source: "The funds are managed by our open-source",
        smart_contract: "Smart Contract",
      }
    },
    loading: {
      loading: "Loading",
      strings: [ 
        "please wait while we're copy-pasting Whitepapers",
        "please wait while we're inviting Shillers",
        "please wait while we're creating our ERC20 token",
        "please wait while we're moving to a tax haven"],
      be_patient: "Nebulas has been having some issues recently, please be patient",
      wow: "...wow...",
    },
    no_ext: {
      getting_started: "Getting Started",
      to_play: "To play ICOSim you need the Nebulas ",
      and_some_nas: "and some NAS",
      ill_give_you: "I'll give you money to play!  Just post your address in our",
      you_can_buy_from: "You can also buy NAS from",
      super_cheap: "NAS transactions are super cheap, you can play for weeks for a just a penny",
      about: {
        title: "About ICOSim.io",
        p1: "Launch your own coin, meet milestones on your roadmap, hire the best shillers in the business, and finally, culminate all that worth into a lucrative exit scam. The path to your very own moon Lambo starts here",
        p2: "100% of NAS spent is redistributed to players who \"Exit Scam\".  The value you may claim is determined by the ICOs market cap. So hype your ICO before you dump your bags.  ",
        p3: "The amount you can get when exit scamming may go down when others play. Once you \"Exit Scam\" you may start over by launching a new ICO.",
        good_luck: "Good Luck!",
        disclaimer: "May not prove profitable.  This is a game!  Do not spend more than you are willing to lose.",
        open_source: "The funds are managed by our open-source ",
        smart_contract: "Smart Contract",
      }
    },
    notifications: {
      tx_success: "Transaction successful",
      tx_posted: "Transaction posted",
      open_in_explorer: "Open in Explorer",
      bought: "Bought",
    },
    penis: {
      penis: "Penis",
    },
    poor: {
      title: "You Need NAS",
      p1: "The game is free to play, but you do need a small balance to cover gas.  It seems you are out of money.",
      post_to_discord: "Just post your address in our",
      or_buy_from: "You can also buy NAS from",
      nas_is_cheap: "NAS transactions are super cheap, you can play for weeks for a just a penny.",
    },
    items: {
      production: "Production",
      bonus: "Bonus",
      buy_to_unlock_advisor: "BUY TO UNLOCK ADVISOR",
      price: "Price",
      level: "Level",
      you_have: "You have",
      buy: "Buy",
      buy_for: "BUY for",
      buy_with_nas: "BUY w/ NAS",
      percent_to_players: "100% of NAS goes back to players",
      advisors: "Advisors",
      roadmap: "Roadmap",
      team: {
        roger: {
          name: "Roger Ver",
          desc: "The most passionate in the business",
          quote: "_ is the real Bitcoin",
        },
        mcafee: {
          name: "John McAfee",
          desc: "Each tweet averages $3 million in revenue",
          quote: "No. Not joking. _ is a legitimate privacy coin and it\'s also selling for less than three cents.",
        },
        carlos: {
          name: "Carlos Matos",
          desc: "The best Hype Man crypto has ever seen",
          quote: "Wassa Wassa Wassa Wassa Up _",
        },
        tom: {
          name: "Tom Lee",
          desc: "The Permabull",
          quote: "_ to $25k by 2019",
        },
        grant: {
          name: "Craig Grant",
          desc: "I started with $100 six months ago",
          quote: "Look at the _ I earned, and didn\'t buy",
        },
        ian: {
          name: "Ian Balina",
          desc: "\'Hacking the System\' and only hacked once",
          quote: "ICO Grade for _ is 99%",
        },
        suppoman: {
          name: "Suppoman",
          desc: "Your superhero of cryptocurrency",
          quote: "_ is one of the TOP 5 BEST ICOs of the year",
        },
        trevon: {
          name: "Trevon James",
          desc: "Don\'t talk to me unless it\'s about intangible coins",
          quote: "This is day 30 of _, I\'ve earned 30 Bitcoin so far",
        },
        wright: {
          name: "Dr Craig S Wright",
          desc: "Imagine that, having Satoshi as your advisor!",
          quote: "I am going full billionaire mode on _",
        },
      }
    },
    wrong_network: {
      title: "Wrong Network!",
      p1: "Please switch the NAS extension wallet to point to MAINNET.",
      p2: "Then refresh the page.",
    },
  },
  cn: {
    units: {
        per_s: "/秒",
    },
    nav:  {
            home: "家",
            icos: "ICOs",
          },
          airdrops:  {
            success: "成功声称空投！",
            airdrop_in_x_blocks: "空投在{count}个街区(〜{block_time} 小号)", // : {count} blocks (~{block_time}s)
            claim_worth: "索赔空投值得",
            seconds: "秒",
            blocks_remaining: "剩余块",
          },
          cmc:  {
            icos: "ICOs",
            market_cap: "市值",
            growth: "成长",
            scammers: "诈骗者",
            taken: "被盗",
            top_scammers: "NAS采取的顶级诈骗者",
            top_icos: "按市值划分的顶级ICO",
            exit_value: "退出值",//退出前
            exit_amount: "退出金额",//退出后
            tickers: "股票行情",
            name: "名称",
            owner: "所有者",
          },
          details:  {
            market_cap: "市值",
            not_your_ico: "不是你的ICO",
            launch_your_own: "启动你自己的ICO",
            exit_scam: "退出诈骗",
            value: "价值",
            amount_taken: "拍摄金额",
            exit_scam_now: "现在退出骗局",
            about_exit:  {
              title: "什么是退出诈骗？",
              p1: "100％的NAS花费被重新分配给“退出骗局”的玩家。 您可能要求的价值取决于ICO的市值。 所以在你丢弃行李之前宣传你的ICO。",
              p2: "当其他人玩游戏时，退出诈骗时可以获得的金额可能会下降。 一旦你“退出诈骗”，你可以通过推出一个新的ICO重新开始。",
              good_luck: "祝你好运",
            }
          },
          footer:  {
            redistributed: "100％的NAS花费被重新分配给“退出骗局”的玩家",
            created_by: "由...创建",
            view_the: "查看",
            smart_contract: "智能合约",
            questions: "问题,问题,或者只是想要闲逛",
            join_our: "加入我们的",
            discord: "Discord",
            dont_spend_more_than: "不要花费超过你愿意失去的",
          },
          launch:  {
            welcome: "欢迎",
            intro: "发布ICO的时间。请检查门口的道德。",
            name: "名称",
            ticker: "股票行情",
            not_available: "不可用",
            launch_ico: "启动ICO",
            about:  {
              title: "关于ICOSim.io",
              p1: "推出自己的硬币,在你的路线图上达到里程碑,雇用业务中最好的杀手,最后,将所有这些价值推向一个有利可图的退出骗局。通往你自己的月亮兰博的道路从这里开始",
              p2: "100％的NAS花费被重新分配给“退出骗局”的玩家。 您可能要求的价值取决于ICO的市值。 所以在你丢弃行李之前宣传你的ICO。",
              p3: "当其他人玩游戏时，退出诈骗时可以获得的金额可能会下降。 一旦你“退出诈骗”，你可以通过推出一个新的ICO重新开始。",
              disclaimer: "可能无法证明是有利可图的。这是一场游戏！不要花费超过你愿意失去的钱。",
              good_luck: "祝你好运！",
              open_source: "资金由我们的开源管理",
              smart_contract: "智能合约",
            }
          },
          loading:  {
            loading: "正在加载",
            strings:  [
              "请等我们复制粘贴白皮书",
              "请等我们邀请营销人员",
              "我们在创建ERC20令牌时请等待",
              "请等我们搬到避税天堂",],
            be_patient: "星云最近出现了一些问题,请耐心等待",
            wow: "...哇...",
          },
          no_ext:  {
            getting_started: "入门",
            to_play: "要玩ICOSim,你需要星云",
            and_some_nas: "和一些NAS",
            ill_give_you: "我会给你钱玩！只需在我们的地址发布你的地址",
            you_can_buy_from: "你也可以从中购买NAS",
            super_cheap: "NAS交易非常便宜,只需一分钱便可玩几周",
            about:  {
              title: "关于ICOSim.io",
              p1: "推出自己的硬币,在你的路线图上达到里程碑,雇用业务中最好的杀手,最后,将所有这些价值推向一个有利可图的退出骗局。通往你自己的月亮兰博的道路从这里开始",
              p2: "100％的NAS花费被重新分配给“退出骗局”的玩家。 您可能要求的价值取决于ICO的市值。 所以在你丢弃行李之前宣传你的ICO。",
              p3: "当其他人玩游戏时，退出诈骗时可以获得的金额可能会下降。 一旦你“退出诈骗”，你可以通过推出一个新的ICO重新开始。",
              good_luck: "祝你好运！",
              disclaimer: "可能无法证明是有利可图的。这是一场游戏！不要花费超过你愿意失去的钱。",
              open_source: "资金由我们的开源管理",
              smart_contract: "智能合约",
            }
          },
          notifications:  {
            tx_success: "交易成功",
            tx_posted: "已发布交易",
            open_in_explorer: "在资源管理器中打开",
            buy: "买了",
          },
          penis:  {
            penis: "阴茎",
          },
          poor:  {
            title: "你需要NAS",
            p1: "游戏是免费的,但你需要一个小的余额来覆盖汽油。看来你没钱了。",
            post_to_discord: "只需在我们的地址发布您的地址",
            or_buy_from: "你也可以从中购买NAS",
            nas_is_cheap: "NAS交易非常便宜,只需一分钱便可玩几周。",
          },
      items:  {
            production: "生产",
            bonus: "奖金",
            buy_to_unlock_advisor: "购买解锁顾问",
            price: "价格",
            level: "等级",
            you_have: "你有",
            buy: "买",
            buy_for: "买",
            buy_with_nas: "用NAS购买",
            percent_to_players: "100％的NAS回归玩家",
            advisors: "顾问",
            roadmap: "路线图",
            team:  {
              roger:  {
                name: "Roger Ver",
                desc: "业务中最热衷的",
                quote: "_是真正的比特币",
              },
              mcafee:  {
                name: "John McAfee",
                desc: "每条推文的平均收入为300万美元",
                quote: "不。不是在开玩笑._是一个合法的隐私硬币,而且卖的价格还不到三美分。",
              },
              carlos:  {
                name: "Carlos Matos",
                desc: "最好的炒作人加密有史以来",
                quote: "Wassa Wassa Wassa Wassa Up _",
              },
              tom:  {
                name: "Tom Lee",
                desc: "永久公牛",
                quote: "到2019年_到$ 25k",
              },
              grant:  {
                name: "Craig Grant",
                desc: "六个月前我以100美元开头",
                quote: "看看_我赚了,没买",
              },
              ian:  {
                name: "Ian Balina",
                desc: "“黑客攻击系统”只攻击一次",
                quote: "_的ICO等级为99％",
              },
              suppoman:  {
                name: "Suppoman",
                desc: "你的加密货币的超级英雄",
                quote: "_是年度最佳5大ICO之一",
              },
              trevon:  {
                name: "Trevon James",
                desc: "除非关于无形硬币,否则别跟我说话",
                quote: "这是_的第30天,到目前为止我已经获得了30比特币",
              },
              wright:  {
                name: "Dr Craig S Wright",
                desc: "想象一下,让Satoshi作为你的顾问！",
                quote: "我要在_上完全亿万富翁模式",
              },
            }
          },
          wrong_network:  {
            title: "错误的网络！",
            p1: "请切换NAS扩展钱包指向MAINNET。",
            p2: "然后刷新页面。",
          },
  }
}



// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
  fallbackLocale: 'en',
})









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

function limitString(value, max_length)
{
    if(!value || value.length <= max_length + 1)
    {
        return value;
    }

    let midpoint = max_length / 2;
    let result = value.substring(0, midpoint);
    result += "...";
    let start_of_end = value.length - midpoint;
    result += value.substring(start_of_end);
    return result;
}

Vue.filter('name', function (value) 
{
  return limitString(value, 50);
});

Vue.filter('ticker', function (value) 
{
  return limitString(value, 8);
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
  template: '<App/>',
  i18n,

});



  