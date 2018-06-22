BigNumber.config({ DECIMAL_PLACES: 10, ROUNDING_MODE: 1 })

// TODO input validation

var Contract = function() 
{
  // all_users, all_items, active_icos
  LocalContractStorage.defineMapProperty(this, "lists"); 

  // {nas_redeemed, active_ico: txhash, retired_icos: [txhash]}
  LocalContractStorage.defineMapProperty(this, "addr_to_user"); 
  
  // {name, ticker, resources, total_production_rate, last_action_date, items: {'Pick Axe': 2, 'Shield': 1}}  
  LocalContractStorage.defineMapProperty(this, "icohash_to_ico");

  LocalContractStorage.defineMapProperty(this, "ticker_to_icohash"); 
  
  // {name: "Tom Lee", start_price: 1, resources_per_s: 1 (or bonus_multiplier)} 
  LocalContractStorage.defineMapProperty(this, "name_to_item");

  LocalContractStorage.defineProperty(this, "starting_resources",
  {
    stringify: function(obj)
    {
      return obj.toString();
    },
    parse: function(str)
    {
      return new BigNumber(str);
    }
  });

  LocalContractStorage.defineProperty(this, "total_resources",
  {
    stringify: function(obj)
    {
      return obj.toString();
    },
    parse: function(str)
    {
      return new BigNumber(str);
    }
  });

  LocalContractStorage.defineProperty(this, "world_resources",
  {
    stringify: function(obj)
    {
      return obj.toString();
    },
    parse: function(str)
    {
      return new BigNumber(str);
    }
  });
  
  LocalContractStorage.defineProperty(this, "nas",
  {
    stringify: function(obj)
    {
      return obj.toString();
    },
    parse: function(str)
    {
      return new BigNumber(str);
    }
  });

  LocalContractStorage.defineProperty(this, "buy_price_nas_per_resource",
  {
    stringify: function(obj)
    {
      return obj.toString();
    },
    parse: function(str)
    {
      return new BigNumber(str);
    }
  });
  
  LocalContractStorage.defineProperty(this, "owner_addr");
}

Contract.prototype = 
{
  //#region Asserts
  assertIsOwner: function()
  {
    if(!this.isOwner())
    {
      throw new Error("This is an owner only call.");
    }
  },
  //#endregion

  //#region Owner only
  init: function(starting_resources) 
  {
    this.lists.put("all_users", []);
    this.lists.put("all_items", []);
    this.lists.put("active_icos", []);
    
    if(!starting_resources)
    {
      starting_resources = 0;
    }
    this.nas = new BigNumber(Blockchain.transaction.value);
    this.starting_resources = new BigNumber(starting_resources);
    this.total_resources = new BigNumber(0);
    this.world_resources = new BigNumber(0);
    this.buy_price_nas_per_resource = new BigNumber(1);
    this.owner_addr = Blockchain.transaction.from;
  },
  
  setStartingResources : function(starting_resources)
  {
    this.assertIsOwner();

    this.starting_resources = new BigNumber(starting_resources);
    if(!this.starting_resources.isInteger()
      || this.starting_resources.lt(1))
    {
      throw new Error("Invalid amount: " + this.starting_resources + " from (" + starting_resources + ")");
    }
  },
  
  setWorldResources : function(world_resources)
  {
    this.assertIsOwner();

    this.world_resources = new BigNumber(world_resources);
    if(!this.world_resources.isInteger())
    {
      throw new Error("Invalid amount: " + this.world_resources + " from (" + world_resources + ")");
    }
  },

  setBuyPrice : function(nas_per_resource)
  {
    this.assertIsOwner();

    this.buy_price_nas_per_resource = nas_per_resource;
  },
  
  isOwner: function()
  {
    return this.owner_addr == Blockchain.transaction.from;
  },
  
  changeOwner: function(new_owner_addr)
  {
    this.assertIsOwner();

    if(!Blockchain.verifyAddress(new_owner_addr))
    {
      throw new Error("What are you changing the address to? You entered: " + new_owner_addr);
    }

    this.owner_addr = new_owner_addr;
  },
  
  createItem: function(item)
  {
    this.assertIsOwner();

    if(!item || !item.name)
    {
      throw new Error("Invalid item: " + item);
    }

    var all_items = this.lists.get("all_items");
    if(all_items.indexOf(item.name) < 0)
    {
      all_items.push(item.name);
      this.lists.put("all_items", all_items);
    }

    this.name_to_item.put(item.name, item);
  },
  //#endregion

  //#region User management
  getOrCreateUser: function()
  {
    var user = this.addr_to_user.get(Blockchain.transaction.from);
    if(!user)
    {
      user = {
        addr: Blockchain.transaction.from,
        nas_redeemed: new BigNumber(0), 
        active_ico: null,
        retired_icos: []
      };
      this.addr_to_user.put(Blockchain.transaction.from, user);
      addToList(this.lists, "all_users", Blockchain.transaction.from);
    }
    return user;
  },

  getUser: function(addr)
  {
    return this.addr_to_user.get(addr);
  },
  //#endregion

  //#region ICO managment
  launchICO: function(name, ticker)
  {
    var user = this.getOrCreateUser();
    if(user.active_ico)
    {
      throw new Error("You can only run one ICO at a time.");
    }
    if(!ticker)
    {
      throw new Error("Please specify a ticker!");
    }
    if(this.ticker_to_icohash.get(ticker))
    {
      throw new Error("There was already an ICO by that name, choose something unique.");
    }

    var ico = {
      id: Blockchain.transaction.hash,
      player_addr: Blockchain.transaction.from,
      name,
      ticker,
      resources: this.starting_resources, 
      total_production_rate: 0,
      last_action_date: Date.now(), 
      items: {}
    }

    this.total_resources = this.total_resources.plus(this.starting_resources);
    
    this.icohash_to_ico.put(ico.id, ico);
    this.ticker_to_icohash.put(ticker, ico.id);
    user.active_ico = ico.id;
    this.addr_to_user.put(Blockchain.transaction.from, user);
    addToList(this.lists, "active_icos", ico.id);

    return ico.id;
  },

  getActiveICO: function()
  {
    var user = this.getOrCreateUser();
    if(!user.active_ico)
    {
      throw new Error("Please start an ICO first.");
    }

    return this.getICO(user.active_ico);
  },
  
  getICO: function(icohash)
  {
    return this.icohash_to_ico.get(icohash);
  },

  getICOId: function(ticker)
  {
    return this.ticker_to_icohash.get(ticker);
  },
  //#endregion

  //#region Resource and Money management
  accept: function() 
  {
    var ico = this.getActiveICO();
    var amount = Blockchain.transaction.value.div(this.buy_price_nas_per_resource);
    this.total_resources = this.total_resources.plus(amount);
    ico.resources = new BigNumber(ico.resources).plus(amount);
    this.icohash_to_ico.put(ico.id, ico);
    this.nas = this.nas.plus(Blockchain.transaction.value);
  }, 

  getSmartContractBalance: function()
  {
    // this does not work on mainnet... tracking ourselves as a workaround
    //return new BigNumber(Blockchain.getAccountState(Blockchain.transaction.to).balance);
    return this.nas;
  },  

  getBuyPriceNasPerResource : function() 
  {
    return this.buy_price_nas_per_resource;
  },

  getSellPriceResourcesPerNas: function()
  {
    var balance = this.getSmartContractBalance(); 
    if(!balance.gt(0))
    {
      return 0;
    }

    return this.total_resources.plus(this.world_resources).mul(10).div(balance);
  },

  getMyResources: function()
  {
    var ico = this.getActiveICO();
    return new BigNumber(ico.resources).plus(this.getMyPendingResources());
  },

  getMyResourcesNasValue: function()
  {
    var ico = this.getActiveICO();
    if(Object.keys(ico.items).length < 1)
    {
      return 0;
    }

    this.redeemResources();
    var resources_per_nas = this.getSellPriceResourcesPerNas();
    var my_resources = this.getMyResources();
    if(!resources_per_nas || !resources_per_nas.lt(my_resources) || !my_resources)
    {
      return 0;
    }
    return my_resources.div(resources_per_nas);
  },

  getMyItemProductionRate: function(name)
  {
    var item = this.getItemRaw(name);
    if(!item.resources_per_s)
    {
      return null;
    }
    var ico = this.getActiveICO();
    var count = ico.items[name];
    if(!count)
    {
      return new BigNumber(0);
    }
    return new BigNumber(item.resources_per_s).mul(count);
  },

  getMyProductionRate: function()
  {
    var total_rate = new BigNumber(0);
    
    var all_items = this.lists.get("all_items");
    for(var i = 0; i < all_items.length; i++)
    {
      var name = all_items[i];
      var rate = this.getMyItemProductionRate(name);
      if(rate)
      {
        total_rate = total_rate.plus(rate);
      }
    }
    
    return total_rate;
  },

  getTimePassed: function(icohash)
  {
    var ico = this.getICO(icohash);
    if(!ico)
    {
      return new BigNumber(0);
    }

    var time_passed = Date.now() - ico.last_action_date;
    if(time_passed < 0)
    {
      time_passed = 0;
    }
    return new BigNumber(time_passed).div(1000); // to seconds
  },

  getMyProductionSinceLastRedeem: function()
  {
    var user = this.getOrCreateUser();
    var time_passed = this.getTimePassed(user.active_ico);

    return this.getMyProductionRate().mul(time_passed);
  },

  getMyItemBonus: function(name)
  {
    var item = this.getItemRaw(name);
    if(!item.bonus_multiplier)
    {
      return null;
    }
    var ico = this.getActiveICO();
    var count = ico.items[name];
    if(!count)
    {
      return new BigNumber(0);
    }
    return new BigNumber(item.bonus_multiplier).mul(count);
  },

  getMyBonus: function()
  {
    var total_bonus = new BigNumber(0);
    var all_items = this.lists.get("all_items");
    for(var i = 0; i < all_items.length; i++)
    {
      var name = all_items[i];
      var item_bonus = this.getMyItemBonus(name);
      if(item_bonus)
      {
        total_bonus = total_bonus.plus(item_bonus);
      }
    }
    return total_bonus;
  },

  getMyPendingResources: function()
  {
    var base = this.getMyProductionSinceLastRedeem();
    var bonus = this.getMyBonus();
    return base.mul(bonus.plus(100)).div(100);
  },
  
  redeemResources: function()
  {
    var pending_resources = this.getMyPendingResources();
    var ico = this.getActiveICO();
    ico.last_action_date = Date.now();
    ico.resources = new BigNumber(ico.resources).plus(pending_resources);
    this.total_resources = this.total_resources.plus(pending_resources);
    this.icohash_to_ico.put(ico.id, ico);

    return ico.resources;
  },

  exitScam: function()
  {
    var user = this.getOrCreateUser();
    var ico = this.getActiveICO();
    var nas = new BigNumber(this.getMyResourcesNasValue().toFixed(0));
    this.total_resources = this.total_resources.sub(ico.resources).plus(this.starting_resources);
    ico.resources = new BigNumber(this.starting_resources);
    ico.items = {};
    user.nas_redeemed = new BigNumber(user.nas_redeemed).plus(nas);
    this.addr_to_user.put(Blockchain.transaction.from, user);
    this.icohash_to_ico.put(ico.id, ico);
    if(!Blockchain.transfer(Blockchain.transaction.from, nas))
    {
      throw new Error("Transfer failed!  Tried to send " + nas + ". The contract has " + this.getSmartContractBalance());
    }

    this.nas = this.nas.sub(nas);

    return nas;
  },
  //#endregion

  //#region Item management
  getAllItemNames: function()
  {
    return this.lists.get("all_items");
  },  

  getItemRaw: function(name)
  {
    var item = this.name_to_item.get(name);
    if(!item)
    {
      throw new Error("Item not found.");
    }

    return item;
  },

  getItem: function(name)
  {
    var item = this.getItemRaw(name);
    var user = this.getOrCreateUser();

    if(user.active_ico)
    {
      item.user_holdings = this.getMyItemCount(name);
      item.user_price = this.getMyItemPrice(name, 1);
      item.user_item_production = this.getMyItemProductionRate(name);
      item.user_item_bonus = this.getMyItemBonus(name);
      item.user_max_can_afford = this.getMaxICanAfford(name);
    }

    return item;
  },
  
  getMyItemCount: function(name)
  {
    var ico = this.getActiveICO();
    var my_count = ico.items[name];
    if(!my_count)
    {
      return new BigNumber(0);
    }
    
    return new BigNumber(my_count);
  },

  getMyItemPrice: function(name, quantity)
  {
    if(!quantity)
    {
      quantity = 1;
    }
    var item = this.name_to_item.get(name);
    if(!item)
    {
      throw new Error("Item not found.");
    }
    var item_count = this.getMyItemCount(name);
    var max = item_count.plus(quantity);
    var multiple = max.mul(max.plus(1)).sub(item_count.mul(item_count.plus(1))).div(2);
    // TODO rename price_multiple to exponent?
    return new BigNumber(item.start_price).mul(multiple.pow(item.price_multiple));
  },

  getMaxICanAfford: function(name)
  {
    this.redeemResources();
    var item = this.getItemRaw(name);
    var ico = this.getActiveICO();

    var p = new BigNumber(ico.resources);
    var s = new BigNumber(item.start_price);
    var c = this.getMyItemCount(name);

    // TODO solve for the square change

    var a = c.mul(2);
    a = a.plus(1);
    a = a.pow(2);
    a = a.mul(s);
    var b = p.mul(8);

    var numerator = a.plus(b);
    numerator = numerator.sqrt();
    var divisor = s.sqrt();
    var result = numerator.div(divisor);
    result = result.sub(1);

    return new BigNumber(result.div(2).sub(c).toFixed(0));
  },

  buy: function(name, quantity)
  {
    this.redeemResources();
    var ico = this.getActiveICO();

    if(!quantity)
    { 
      quantity = this.getMaxICanAfford(name);
    }

    var price = this.getMyItemPrice(name, quantity);
    if(price.gt(ico.resources))
    {
      throw new Error("You can't afford that yet.  You have " + ico.resources + " but it costs " + price);
    }
    
    ico.resources = new BigNumber(ico.resources).sub(price); 
    this.total_resources = this.total_resources.sub(price);
    if(!ico.items[name])
    {
      ico.items[name] = quantity;
    }
    else
    {
      ico.items[name] = new BigNumber(ico.items[name]).plus(quantity);
    }

    ico.total_production_rate = this.getMyProductionRate();

    this.icohash_to_ico.put(ico.id, ico);
  },
  //#endregion

  //#region Dapp calls
  getInfo: function()
  {
    var items = [];
    var all_items = this.lists.get("all_items");
    for(var i = 0; i < all_items.length; i++)
    {
      items.push(this.getItem(all_items[i]));
    }

    var data = {
      smart_contract_balance: this.getSmartContractBalance(),
      buy_price_nas_per_resource: this.getBuyPriceNasPerResource(),
      sell_price_resources_per_nas: this.getSellPriceResourcesPerNas(),
      items
    };

    var user = this.getOrCreateUser();
    if(user.active_ico)
    {
      data.active_ico = this.getICO(user.active_ico);

      data.active_ico.my_resources = this.getMyResources();
      data.active_ico.my_resources_nas_value = this.getMyResourcesNasValue();
      data.active_ico.my_production_rate = this.getMyProductionRate();
      data.active_ico.my_bonus = this.getMyBonus();
    }

    return data;
  },
  //#endregion

  //#region Leaderboard
  getBestKnownScammers(start_index, count)
  {
    var all_users = this.lists.get("all_users");
    var user_list = [];
    for(var i = 0; i < all_users.length; i++)
    {
      var user = this.getUser(all_users[i]);
      if(!user.nas_redeemed)
      {
        continue;
      }
      user_list.push(user);
    }
    user_list.sort(function(a, b)
    {
      return a.nas_redeemed - b.nas_redeemed
    });

    return user_list.slice(start_index, count);
  },

  getICOStats(icohash)
  {
    var ico = this.getICO(icohash);
    var time_passed = this.getTimePassed(icohash);

    delete ico.items;
    ico.market_cap = new BigNumber(ico.resources).plus(new BigNumber(ico.total_production_rate).mul(time_passed));
    
    return ico;
  },

  getCoinMarketCaps(start_index, count)
  {
    var active_icos = this.lists.get("active_icos");
    var ico_list = [];
    for(var i = 0; i < active_icos.length; i++)
    {
      ico_list.push(this.getICOStats(active_icos[i]));
    }
    ico_list.sort(function(a, b)
    {
      return a.market_cap - b.market_cap;
    });

    return ico_list.slice(start_index, count);
  },
  //#endregion 

  //#region Debug
  getList: function(list_name)
  {
    return this.lists.get(list_name);
  },
  //#endregion 
}

module.exports = Contract


function addToList(lists, list_name, item)
{
  var list = lists.get(list_name);
  list.push(item);
  lists.put(list_name, list);
}