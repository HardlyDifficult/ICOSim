BigNumber.config({ DECIMAL_PLACES: 10, ROUNDING_MODE: 1 })

class SafeNumber
{
  constructor(value)
  {
    if(value instanceof SafeNumber)
    {
      this.value = value.value;
    }
    else if(value.value)
    {
      this.value = new BigNumber(value.value);
    }
    else
    {
      this.value = new BigNumber(value);
    }
    this.validate();
  }
  
  validate()
  {
    assert(this.isPositiveWholeNumber(), "Validate: Not a valid SafeNumber value: " + this.value);
  }

  toString()
  {
    this.validate();
    return JSON.stringify(this.value);
  }
  
  plus(b)
  {
    assert(b.isPositiveWholeNumber(), "Plus: Not a valid SafeNumber value: " + b);
    
    var result = new SafeNumber(this.value.plus(b));

    assert(result.value.gte(this.value))
    return result;
  }

  div(b)
  {
    assert(b.isPositiveWholeNumber(), "div: Not a valid SafeNumber value: " + b);
    assert(b.gt(0), "Divide by 0? b:" + b);

    var result = new SafeNumber(this.value.div(b));

    assert(result.value.lte(this.value), "Div: result is greater than the original.  Result: " + result + ", original: " + this.value);
    return result;
  }

  mul(b)
  {
    assert(b.isPositiveWholeNumber(), "mul: Not a valid SafeNumber value: " + b);
    
    var result = new SafeNumber(this.value.mul(b));

    assert(result.value.gte(this.value), "Mul: Result is less than original.  Result: " + result + ", original: " + this.value);
    return result;
  }

  pow(b)
  {
    assert(b.isPositiveWholeNumber(), "Pow: Not a valid SafeNumber value: " + b);

    var result = new SafeNumber(this.value.pow(b));

    assert(result.value.gte(this.value), "Pow: Result is less than original.  Result: " + result + ", original: " + this.value);
    return result;
  }

  gt(b)
  {
    assert(b.isPositiveWholeNumber(), "gt: Not a valid SafeNumber value: " + b);
    return this.value.gt(b);
  }

  eq(b)
  {
    assert(b.isPositiveWholeNumber(), "eq: Not a valid SafeNumber value: " + b);
    return this.value.eq(b);
  }

  lte(b)
  {
    assert(b.isPositiveWholeNumber(), "lte: Not a valid SafeNumber value: " + b);
    return this.value.lte(b);
  }
  
  isPositiveWholeNumber()
  {
    if(!this.value.gte(0))
    {
      return false;
    }
    if(!this.value.isInteger())
    {
      return false;
    }

    return true;
  }
}

class User 
{
  constructor(value)
  {
    this.nas_redeemed = new SafeNumber(value.nas_redeemed);
    this.active_ico_id = value.active_ico_id;
    this.retired_icos = value.retired_icos;
    this.validate();
  }
  
  validate()
  {
    assert(isArray(this.retired_icos), "User, retired ICOs is not an array.");
  }

  toString() 
  {
    this.validate();
    return JSON.stringify(this);
  }
}

class ICO 
{
  constructor(value)
  {
    this.name = value.name;
    this.ticker = value.ticker;
    this.resources = new SafeNumber(value.resources);
    this.total_production_rate = new SafeNumber(value.total_production_rate);
    this.last_action_date = new Date(value.last_action_date);
    this.items = value.items;
    this.validate();
  }
  
  validate()
  {
    assert(isString(this.name, 100), "Please specify a valid name: " + this.name);
    assert(isString(this.ticker, 5), "Please specify a valid ticker: " + this.ticker);
    assert(isDate(this.last_action_date), "ICO, last_action_date is not a date: " + this.last_action_date);
    assert(isArray(this.items), "ICO: items is not an array: " + this.items);
  }

  toString() 
  {
    this.validate();
    return JSON.stringify(this);
  }
}

class Item 
{
  constructor(value)
  {
    this.name = value.name;
    this.sort_id = value.sort_id;
    this.start_price = new SafeNumber(value.start_price);
    this.resources_per_s = value.resources_per_s ? new SafeNumber(value.resources_per_s) : null;
    this.bonus_multiplier = value.bonus_multiplier ? new SafeNumber(value.bonus_multiplier) : null;
    this.validate();
  }
  
  validate()
  {
    assert(isString(this.name, 100), "Please specify a valid name: " + this.name);
    assert(this.resources_per_s != null || this.bonus_multiplier != null, 
      "Either resources_per_s or bonus_multiplier must NOT be null. resources_per_s: " + this.resources_per_s
      + ", bonus_multiplier: " + this.bonus_multiplier);
      
    assert(this.resources_per_s == null || this.bonus_multiplier == null, 
      "Either resources_per_s or bonus_multiplier must be null. resources_per_s: " + this.resources_per_s
      + ", bonus_multiplier: " + this.bonus_multiplier);
  }

  toString() 
  {
    this.validate();
    return JSON.stringify(this);
  }
}

var Contract = function() 
{
  // all_users, all_items, active_icos
  LocalContractStorage.defineMapProperty(this, "lists"); 
  
  // {nas_redeemed, active_ico: txhash, retired_icos: [txhash]}
  LocalContractStorage.defineMapProperty(this, 'addr_to_user', 
  {
    parse: function(value) 
    {
      return new User(JSON.parse(value));
    },
    stringify: function(value) 
    {
      return value.toString();
    },
  });

  // {name, ticker, resources, total_production_rate, last_action_date, items: {'Pick Axe': 2, 'Shield': 1}}  
  LocalContractStorage.defineMapProperty(this, "ico_id_to_ico", 
  {
    parse: function(value) 
    {
      return new ICO(JSON.parse(value));
    },
    stringify: function(value) 
    {
      return value.toString();
    },
  });

  LocalContractStorage.defineMapProperty(this, "ticker_to_ico_id"); 
  
  // {name: "Make a Commit on Github", sort_id: 0, start_price: 1, resources_per_s: 1},
  LocalContractStorage.defineMapProperty(this, "name_to_item", 
  {
    parse: function(value) 
    {
      return new Item(JSON.parse(value));
    },
    stringify: function(value) 
    {
      return value.toString();
    },
  });

  LocalContractStorage.defineProperty(this, "starting_resources",
  {
    parse: function(str)
    {
      return new SafeNumber(JSON.parse(str));
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });

  LocalContractStorage.defineProperty(this, "total_resources",
  {
    parse: function(str)
    {
      return new SafeNumber(JSON.parse(str));
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });

  LocalContractStorage.defineProperty(this, "world_resources",
  {
    parse: function(str)
    {
      return new SafeNumber(JSON.parse(str));
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });
  
  LocalContractStorage.defineProperty(this, "nas",
  {
    parse: function(str)
    {
      return new SafeNumber(JSON.parse(str));
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });

  LocalContractStorage.defineProperty(this, "buy_price_nas_per_resource",
  {
    parse: function(str)
    {
      return new SafeNumber(JSON.parse(str));
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });
  
  LocalContractStorage.defineProperty(this, "owner_addr");
}

Contract.prototype = 
{
  //#region Owner only
  init: function() 
  {
    this.lists.put("all_users", []);
    this.lists.put("all_items", []);
    this.lists.put("active_icos", []);
    
    this.nas = new SafeNumber(Blockchain.transaction.value);
    this.starting_resources = new SafeNumber(0);
    this.total_resources = new SafeNumber(0);
    this.world_resources = new SafeNumber(0);
    this.buy_price_nas_per_resource = new SafeNumber(1);
    this.owner_addr = Blockchain.transaction.from;
  },

  setStartingResources : function(starting_resources)
  {
    assert(this.isOwner(), "This is an owner only call.");
 
    this.starting_resources = new SafeNumber(starting_resources);
  },
  
  setWorldResources : function(world_resources)
  {
    assert(this.isOwner(), "This is an owner only call.");

    this.world_resources = new SafeNumber(world_resources);
  },

  setBuyPrice : function(nas_per_resource)
  {
    assert(this.isOwner(), "This is an owner only call.");

    this.buy_price_nas_per_resource = new SafeNumber(nas_per_resource);
  },
  
  isOwner: function()
  {
    return this.owner_addr == Blockchain.transaction.from;
  },
  
  changeOwner: function(new_owner_addr)
  {
    assert(this.isOwner(), "This is an owner only call.");
    assert(new_owner_addr != null, "Missing new address");

    this.owner_addr = new_owner_addr;
  },
  
  createItem: function(item)
  {
    assert(this.isOwner(), "This is an owner only call.");
    item = new Item(item);
    addToList(this.lists, "all_items", item.name);
    this.name_to_item.put(item.name, item);
  },
  //#endregion

  //#region User management
  getOrCreateUser: function()
  {
    var user = this.addr_to_user.get(Blockchain.transaction.from);
    if(user)
    { 
      user = new User(user);
    }
    else 
    {
      user = new User({
        addr: Blockchain.transaction.from,
        nas_redeemed: new SafeNumber(0), 
        active_ico: null,
        retired_icos: []
      });
            
      this.addr_to_user.put(Blockchain.transaction.from, user);
      addToList(this.lists, "all_users", Blockchain.transaction.from);

      Event.Trigger("newUser", user);
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
    assert(!this.ticker_to_ico_id.get(ticker), "There was already an ICO by that name, choose something unique.  You entered: " + ticker);

    var user = this.getOrCreateUser();
    assert(!user.active_ico, "You can only run one ICO at a time.  Please finish: " + user.active_ico);

    var ico = new ICO({
      id: Blockchain.transaction.hash,
      player_addr: Blockchain.transaction.from,
      name,
      ticker,
      resources: this.starting_resources, 
      total_production_rate: new SafeNumber(0),
      last_action_date: Date.now(), 
      items: {}
    });

    this.total_resources = this.total_resources.plus(ico.resources);
    this.ico_id_to_ico.put(ico.id, ico);
    this.ticker_to_ico_id.put(ticker, ico.id);
    addToList(this.lists, "active_icos", ico.id);
    user.active_ico = ico.id;
    this.addr_to_user.put(Blockchain.transaction.from, user);

    Event.Trigger("newICO", ico);

    return ico.id;
  },

  getActiveICO: function()
  {
    var user = this.getOrCreateUser();
    assert(user.active_ico, "Please start an ICO first.");

    return this.getICO(user.active_ico);
  },
  
  getICO: function(ico_id)
  {
    if(!ico_id)
    {
      var user = this.getOrCreateUser();
      ico_id = user.active_ico;
    }

    var ico = this.ico_id_to_ico.get(ico_id);
    assert(ico, "ICO not found... " + ico_id);

    return new ICO(ico);
  },

  getICOId: function(ticker)
  {
    return this.ticker_to_ico_id.get(ticker);
  },
  //#endregion

  //#region Resource and Money management
  accept: function() 
  {
    var ico = this.getActiveICO();
    var nas_value = new SafeNumber(Blockchain.transaction.value);
    var amount = nas_value.div(this.buy_price_nas_per_resource);
    this.total_resources = this.total_resources.plus(amount);
    ico.resources = ico.resources.plus(amount);
    this.nas = this.nas.plus(nas_value);
    this.ico_id_to_ico.put(ico.id, ico);

    Event.Trigger("buyIn", {
      ico,
      nas_value,
      amount
    });
  }, 

  getSmartContractBalance: function()
  {
    // this does not work on mainnet... tracking ourselves as a workaround
    //return new SafeNumber(Blockchain.getAccountState(Blockchain.transaction.to).balance);
    return this.nas.value;
  },  

  getBuyPriceNasPerResource : function() 
  {
    return this.buy_price_nas_per_resource.value;
  },

  getSellPriceResourcesPerNas: function()
  {
    var balance = this.getSmartContractBalance(); 
    if(!balance.gt(0))
    {
      return 0;
    }

    return this.total_resources.plus(this.world_resources).mul(new SafeNumber(10)).div(balance);
  },

  getMyResources: function(ico_id)
  {
    var ico = this.getICO(ico_id);
    return ico.resources.plus(this.getMyPendingResources(ico_id));
  },

  getMyResourcesNasValue: function(ico_id)
  {
    this.redeemResources(ico_id);
    var resources_per_nas = this.getSellPriceResourcesPerNas();
    var my_resources = this.getMyResources(ico_id);
    if(resources_per_nas.eq(0))
    {
      return 0;
    }
    return my_resources.div(resources_per_nas);
  },

  getMyItemProductionRate: function(item_name, ico_id)
  {
    var item = this.getItemRaw(item_name);
    if(!item.resources_per_s)
    {
      return null;
    }
    var ico = this.getICO(ico_id);
    var count;
    if(ico.items[item_name])
    {
      count = new SafeNumber(ico.items[item_name]);
    }
    else
    {
      count = new SafeNumber(0);
    }
    return item.resources_per_s.mul(count);
  },

  getMyProductionRate: function(ico_id)
  {
    var total_rate = new SafeNumber(0);
    
    var all_items = this.lists.get("all_items");
    for(var i = 0; i < all_items.length; i++)
    {
      var name = all_items[i];
      var rate = this.getMyItemProductionRate(name, ico_id);
      if(rate)
      {
        total_rate = total_rate.plus(rate);
      }
    }
    
    return total_rate;
  },

  getTimePassed: function(ico_id)
  {
    var ico = this.getICO(ico_id);
    var time_passed = Date.now() - ico.last_action_date;
    if(time_passed < 0)
    {
      time_passed = 0;
    }
    return new SafeNumber(time_passed).div(1000); // to seconds
  },

  getMyProductionSinceLastRedeem: function(ico_id)
  {
    var time_passed = this.getTimePassed(ico_id);
    return this.getMyProductionRate(ico_id).mul(time_passed);
  },

  getMyItemBonus: function(name, ico_id)
  {
    var ico = this.getICO(ico_id);
    var item = this.getItemRaw(name);
    if(!item.bonus_multiplier)
    {
      return null;
    }
    var count = ico.items[name];
    if(!count)
    {
      return new SafeNumber(0);
    }
    count = new SafeNumber(count);
    return item.bonus_multiplier.mul(count);
  },

  getMyBonus: function(ico_id)
  {
    var total_bonus = new SafeNumber(0);
    var all_items = this.lists.get("all_items");
    for(var i = 0; i < all_items.length; i++)
    {
      var name = all_items[i];
      var item_bonus = this.getMyItemBonus(name, ico_id);
      if(item_bonus)
      {
        total_bonus = total_bonus.plus(item_bonus);
      }
    }
    return total_bonus;
  },

  getMyPendingResources: function(ico_id)
  {
    var base = this.getMyProductionSinceLastRedeem(ico_id);
    var bonus = this.getMyBonus(ico_id);
    return base.mul(bonus.plus(new SafeNumber(100))).div(new SafeNumber(100));
  },
  
  redeemResources: function(ico_id)
  {
    var ico = this.getICO(ico_id);
    var pending_resources = this.getMyPendingResources(ico_id);
    ico.last_action_date = Date.now();
    ico.resources = ico.resources.plus(pending_resources);
    this.total_resources = this.total_resources.plus(pending_resources);
    this.ico_id_to_ico.put(ico.id, ico);

    Event.Trigger("redeemResources", {
      ico,
      pending_resources
    });

    return ico.resources;
  },

  exitScam: function()
  {
    var user = this.getOrCreateUser();
    var ico = this.getActiveICO();
    var nas = this.getMyResourcesNasValue();
    this.total_resources = this.total_resources.plus(this.starting_resources).sub(ico.resources);
    user.nas_redeemed = user.nas_redeemed.plus(nas);
    this.addr_to_user.put(Blockchain.transaction.from, user);
    if(!Blockchain.transfer(Blockchain.transaction.from, nas))
    {
      throw new Error("Transfer failed!  Tried to send " + nas + ". The contract has " + this.getSmartContractBalance());
    }
    
    this.nas = this.nas.sub(nas);
    
    Event.Trigger("exitScam", {
      ico,
      nas,
    });
    
    ico.resources = this.starting_resources;
    ico.items = {};
    this.ico_id_to_ico.put(ico.id, ico);
    
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
    assert(item, "Item not found.");

    return item;
  },

  getItem: function(name, ico_id)
  {
    var item = this.getItemRaw(name);

    if(ico_id)
    {
      item.user_holdings = this.getMyItemCount(name, ico_id);
      item.user_price = this.getMyItemPrice(name, 1, ico_id);
      item.user_item_production = this.getMyItemProductionRate(name, ico_id);
      item.user_item_bonus = this.getMyItemBonus(name, ico_id);
      item.user_max_can_afford = this.getMaxICanAfford(name, ico_id);
    }

    return item;
  },
  
  getMyItemCount: function(name, ico_id)
  {
    var ico = this.getICO(ico_id);

    var my_count = ico.items[name];
    if(!my_count)
    {
      return new SafeNumber(0);
    }
    
    return new SafeNumber(my_count);
  },

  getTotalCostFor: function(name, quantity)
  {
    var item = this.getItemRaw(name);
    quantity = new SafeNumber(quantity);
    // sum = t^3/3+t^2/2+t/6 sum to t=target_item_count subtract sum to t=start_item_count
    return item.start_price.mul(quantity.pow(new SafeNumber(3)).div(new SafeNumber(3))
      .plus(quantity.pow(new SafeNumber(2)).div(new SafeNumber(2))).plus(quantity.div(new SafeNumber(6))));
  },

  getMyItemPrice: function(name, quantity, ico_id)
  {
    if(quantity)
    {
      quantity = new SafeNumber(quantity);
    }
    else
    {
      quantity = new SafeNumber(1);
    }
    var item_count = this.getMyItemCount(name, ico_id);
    var max_count = plus(item_count, quantity);

    return this.getTotalCostFor(name, max_count).sub(this.getTotalCostFor(name, item_count));
  },

  getMaxICanAfford: function(name, ico_id)
  {
    var ico = this.getICO(ico_id);
    this.redeemResources(ico_id);

    var max = new SafeNumber(0);
    const one = new SafeNumber(1);
    while(ico.resources.gte(this.getMyItemPrice(name, max.plus(one))))
    {
      max = max.plus(one);
    }

    return max;
  },

  buy: function(name, quantity)
  {
    this.redeemResources();
    var ico = this.getActiveICO();

    if(!quantity)
    { 
      quantity = this.getMaxICanAfford(name);
    }
    else
    {
      quantity = new SafeNumber(quantity);
    }

    var price = this.getMyItemPrice(name, quantity);
    if(price.gt(ico.resources))
    {
      throw new Error("You can't afford that yet.  You have " + ico.resources + " but it costs " + price);
    }
    
    ico.resources = ico.resources.sub(price); 
    this.total_resources = this.total_resources.sub(price);
    if(!ico.items[name])
    {
      ico.items[name] = quantity;
    }
    else
    {
      ico.items[name] = new SafeNumber(ico.items[name]).plus(quantity);
    }

    ico.total_production_rate = this.getMyProductionRate();

    Event.Trigger("buy", {
      ico,
      name,
      quantity,
      price
    });

    this.ico_id_to_ico.put(ico.id, ico);
  },
  //#endregion

  //#region Dapp calls
  getInfo: function(ticker)
  {
    var items = [];
    var all_items = this.lists.get("all_items");
    var ico_id;
    if(ticker)
    {
      ico_id = this.ticker_to_ico_id.get(ticker);
    }
    else
    {
      var user = this.getOrCreateUser();
      ico_id = user.active_ico;
    }

    for(var i = 0; i < all_items.length; i++)
    {
      items.push(this.getItem(all_items[i], ico_id));
    }

    var data = {
      smart_contract_balance: this.getSmartContractBalance(),
      buy_price_nas_per_resource: this.getBuyPriceNasPerResource(),
      sell_price_resources_per_nas: this.getSellPriceResourcesPerNas(),
      items
    };

   
    if(ico_id)
    {
      data.active_ico = this.getICO(ico_id);

      data.active_ico.my_resources = this.getMyResources(ico_id);
      data.active_ico.my_resources_nas_value = this.getMyResourcesNasValue(ico_id);
      data.active_ico.my_production_rate = this.getMyProductionRate(ico_id);
      data.active_ico.my_bonus = this.getMyBonus(ico_id);
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
      if(user.nas_redeemed.lte(0))
      {
        continue;
      }
      user_list.push(user);
    }
    user_list.sort(function(a, b)
    {
      return nas_redeemed.sub(b.nas_redeemed);
    });

    return user_list.slice(start_index, count);
  },

  getICOStats(ico_id)
  {
    var ico = this.getICO(ico_id);
    var time_passed = this.getTimePassed(ico_id);

    delete ico.items;
    ico.market_cap = ico.resources.plus(ico.total_production_rate).mul(time_passed);
    
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

function assert(value, message)
{
  if(value !== true)
  {
    throw new Error("Failed assert: " + message);
  }
}

function addToList(lists, list_name, item)
{
  var list = lists.get(list_name);
  list.push(item);
  lists.put(list_name, list);
}

function isString(value, max_length)
{
  if(typeof(value) !== 'string')
  {
    return false;
  }

  if(value.length <= 0)
  {
    return false;
  }

  return value.length <= max_length;
}


function isDate(value)
{
  return value instanceof Date && !isNaN(d);
}

function isArray(value) 
{
  return value instanceof Array;
}
