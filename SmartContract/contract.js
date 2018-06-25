BigNumber.config({ DECIMAL_PLACES: 10, ROUNDING_MODE: 1 })
class SafeNumber
{
  constructor(value)
  {
    if(value instanceof SafeNumber)
    {
      this.value = value.value;
    }
    else if(value.value != null)
    {
      this.value = new BigNumber(value.value);
    }
    else
    {
      assert(typeof(value) == "string" || typeof(value) == "object" || value == 0, "SafeNumber must be constructed from a string: " + value + " type " + typeof(value) + " json: " + JSON.stringify(value));
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
    return this.value.toString();
  }
  
  plus(b)
  {
    assert(b.isPositiveWholeNumber(), "Plus: Not a valid SafeNumber value: " + b);
    
    var result = new SafeNumber(this.value.plus(b));

    assert(result.value.gte(this.value), "Plus: Result is less than the original. Result " + result + ", original" + this.value);
    return result;
  }

  sub(b)
  {
    assert(b.isPositiveWholeNumber(), "Sub: Not a valid SafeNumber value: " + b);
    
    var result = new SafeNumber(this.value.sub(b));

    assert(result.value.lte(this.value), "Sub: Result is greater than the original. Result " + result + ", original" + this.value);
    return result;
  }

  div(b)
  {
    assert(b.isPositiveWholeNumber(), "div: Not a valid SafeNumber value: " + b);
    assert(b.value.gt(0), "Divide by 0? b:" + b);

    var result = new SafeNumber(this.value.div(b));

    assert(result.value.lte(this.value), "Div: result is greater than the original.  Result: " + result + ", original: " + this.value);
    return result;
  }

  mul(b)
  {
    assert(b.isPositiveWholeNumber(), "mul: Not a valid SafeNumber value: " + b);
    
    var result = new SafeNumber(this.value.mul(b));

    assert(result.value.gte(this.value) || b.value.eq(0), "Mul: Result is less than original.  Result: " + result + ", original: " + this.value);
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

  gte(b)
  {
    assert(b.isPositiveWholeNumber(), "gte: Not a valid SafeNumber value: " + b);
    return this.value.gte(b);
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
SafeNumber.prototype.toJSON = function() 
{
  return this.toString();
};
class User 
{
  constructor(value)
  {
    this.addr = value.addr;
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
    this.id = value.id;
    this.player_addr = value.player_addr;
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
    assert(isString(this.id, 200), "Invalid ICO ID: " + this.id);
    assert(isString(this.name, 100), "Please specify a valid name: " + this.name);
    assert(isString(this.ticker, 5), "Please specify a valid ticker: " + this.ticker);
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
    this.nas_price = new SafeNumber(value.nas_price);
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
class EventConfig 
{
  constructor(value)
  {
    this.interval = new BigNumber(value.interval);
    this.min_reward = new BigNumber(value.min_reward);
    this.max_reward = new BigNumber(value.max_reward);
    this.min_reward_percent = new BigNumber(value.min_reward_percent);
    this.max_reward_percent = new BigNumber(value.max_reward_percent);
    this.min_length = new BigNumber(value.min_length);
    this.max_length = new BigNumber(value.max_length);
    this.validate();
  }
  
  validate()
  {
    assert(this.interval.gt(2), "Interval is too small.  Got: " + this.interval + ", from " + JSON.stringify(this));
    assert(this.max_reward.gte(this.min_reward), "max reward must be greater than min");
    assert(this.max_length.gte(this.min_length), "max length must be greater than min");
    assert(this.max_length.lt(this.interval), "max must be less than the interval");
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
      return new SafeNumber(str);
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
      return new SafeNumber(str);
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
      return new SafeNumber(str);
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
      return new SafeNumber(str);
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });
  
  LocalContractStorage.defineProperty(this, "owner_addr");

  LocalContractStorage.defineProperty(this, "event_config",
  {
    parse: function(str)
    {
      return new EventConfig(str);
    },
    stringify: function(obj)
    {
      return obj.toString();
    },
  });
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
  
  setEventConfig: function(event_config)
  {
    assert(this.isOwner(), "This is an owner only call.");
    
    this.event_config = new EventConfig(event_config);
    return this.event_config;
  },

  getEventConfig: function()
  {
    return this.event_config;
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
        active_ico_id: null,
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
    assert(!user.active_ico_id, "You can only run one ICO at a time.  Please finish: " + user.active_ico_id);

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
    this.ticker_to_ico_id.put(ico.ticker, ico.id);
    addToList(this.lists, "active_icos", ico.id);
    user.active_ico_id = ico.id;
    this.addr_to_user.put(Blockchain.transaction.from, user);

    Event.Trigger("newICO", ico);
  },

  getActiveICO: function()
  {
    var user = this.getOrCreateUser();
    assert(user.active_ico_id, "Please start an ICO first.");

    return this.getICO(user.active_ico_id);
  },
  
  getICO: function(ico_id)
  {
    if(!ico_id)
    {
      var user = this.getOrCreateUser();
      ico_id = user.active_ico_id;
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
  buyWithNas: function(name, count)
  {
    var item = this.getItemRaw(name);
    count = new SafeNumber(count);
    var cost = item.nas_price.mul(count);
    if(cost.gt(new SafeNumber(Blockchain.transaction.value)))
    {
      throw new Error("You didn't send enough nas. " + count + " of " + name + " costs " + cost + " but you sent " + Blockchain.transaction.value);
    }
    var nas_value = new SafeNumber(Blockchain.transaction.value);
    this.nas = this.nas.plus(nas_value);
    var ico = this.getActiveICO();

    if(!ico.items[name])
    {
      ico.items[name] = count;
    }
    else
    {
      ico.items[name] = new SafeNumber(ico.items[name]).plus(count);
    }

    this.ico_id_to_ico.put(ico.id, ico);
    ico.total_production_rate = this.getMyProductionRate();
    this.ico_id_to_ico.put(ico.id, ico);

    Event.Trigger("buyWithNas", {
      ico,
      nas_value,
      name,
      count
    });
  }, 

  getSmartContractBalance: function()
  {
    // this does not work on mainnet... tracking ourselves as a workaround
    //return new SafeNumber(Blockchain.getAccountState(Blockchain.transaction.to).balance);
    return this.nas;
  },  

  getSellPriceNasPerResource: function()
  {
    var balance = this.getSmartContractBalance(); 
    if(!balance.gt(new SafeNumber(0)))
    {
      return new SafeNumber(0);
    }

    var sell_price = new SafeNumber(balance.value.div(this.total_resources.value.plus(this.world_resources.value)).plus(0.001).toFixed(0));
    if(sell_price.lte(1))
    {
      sell_price = new SafeNumber("1");
    }
    return sell_price;
  },

  getMyResources: function(ico_id)
  {
    var ico = this.getICO(ico_id);
    return ico.resources.plus(this.getMyPendingResources(ico_id));
  },

  getMyResourcesNasValue: function(ico_id)
  {
    var nas_per_resource = this.getSellPriceNasPerResource();
    var my_resources = this.getMyResources(ico_id);
    if(nas_per_resource.eq(new SafeNumber(0)))
    {
      return new SafeNumber(0);
    }
    return my_resources.mul(nas_per_resource);
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
    time_passed = new SafeNumber(time_passed.toString());
    const ms_to_s = new SafeNumber("1000");
    return time_passed.div(ms_to_s); // to seconds
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
    return new SafeNumber(base.value.mul(bonus.value.plus(100)).div(100).plus(.001).toFixed(0));
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

  getTotalPlayerResources()
  {
    return this.total_resources;
  },

  getWorldResources()
  {
    return this.world_resources;
  },

  exitScam: function()
  {
    this.redeemResources();
    var nas = this.getMyResourcesNasValue();
    if(nas.gt(this.nas))
    { // Just in case a rounding issue
      nas = this.nas;
    }

    var user = this.getOrCreateUser();
    user.nas_redeemed = user.nas_redeemed.plus(nas);
    if(!Blockchain.transfer(Blockchain.transaction.from, nas))
    {
      throw new Error("Transfer failed!  Tried to send " + nas + ". The contract has " + this.getSmartContractBalance());
    }
    
    this.nas = this.nas.sub(nas);

    var ico = this.getActiveICO();
    this.total_resources = this.total_resources.sub(ico.resources);
    user.retired_icos.push(ico.id);
    user.active_ico_id = null;
    removeFromList(this.lists, "active_icos", ico.id);
    this.addr_to_user.put(Blockchain.transaction.from, user);
    
    Event.Trigger("exitScam", {
      ico,
      nas,
    });
    
    return nas;
  },

  forceExit: function(ico_id)
  {
    assert(this.isOwner());

    var ico = this.getICO(ico_id);
    this.total_resources = this.total_resources.sub(ico.resources);
    var user = this.getUser(ico.player_addr);
    user.retired_icos.push(ico.id);
    user.active_ico_id = null;
    removeFromList(this.lists, "active_icos", ico.id);
    this.addr_to_user.put(user.addr, user);
    
    Event.Trigger("forceExis", {
      ico,
    });
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
      item.user_price = this.getMyItemPrice(name, "1", ico_id);
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
    if(!quantity)
    {
      quantity = 1;
    }
    quantity = new BigNumber(quantity);
    // sum = p * c^2
    return new SafeNumber(item.start_price.value.mul(quantity.pow(2)).plus(0.001).toFixed(0));
  },

  getMyItemPrice: function(name, quantity, ico_id)
  {
    if(quantity)
    {
      quantity = new SafeNumber(quantity);
    }
    else
    {
      quantity = new SafeNumber("1");
    }
    var item_count = this.getMyItemCount(name, ico_id);
    var max_count = item_count.plus(quantity);

    return this.getTotalCostFor(name, max_count).sub(this.getTotalCostFor(name, item_count));
  },

  getMaxICanAfford: function(name, ico_id)
  {
    var ico = this.getICO(ico_id);
    var item = this.getItemRaw(name);

    var x = ico.resources.value;
    var c = this.getMyItemCount(name, ico_id).value;
    var p = item.start_price.value;
    
    var sq = (p.mul(c.pow(2).mul(p).plus(x))).sqrt();
    var cp = c.mul(p);

    var count1 = sq.plus(cp).div(p).mul(-1);
    var count2 = sq.sub(cp).div(p);
    var count;
    if(count1.gt(count2))
    {
      count = count1;
    }
    else
    {
      count = count2;
    }
    
    return new SafeNumber(count.plus(.001).toFixed(0));
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

    Event.Trigger("buy", {
      ico,
      name,
      quantity,
      price
    });
    
    this.ico_id_to_ico.put(ico.id, ico);
    ico.total_production_rate = this.getMyProductionRate();
    this.ico_id_to_ico.put(ico.id, ico);
  },
  //#endregion
  //#region Events
  getBlocksTillNextEvent: function()
  {
    return Blockchain.block.height.mod(this.event_config.interval);
  },

  // {reward_percent, min_reward, max_reward, number_of_blocks_remaining}
  getCurrentEvent: function()
  {
    var offset = Blockchain.block.height.mod(this.event_config.interval);
    var seed = Blockchain.getPreBlockSeed(offset);
    Math.random.seed(seed);
    var number_of_blocks = (this.event_config.max_length.sub(this.event_config.min_length)).plus(this.event_config.min_length).mul(Math.random());
    if(number_of_blocks.gt(offset))
    {
      throw new Error("Too late, that event has ended.  Sit tight, another will begin in " + this.getBlocksTillNextEvent() + " blocks.");
    }

    var reward_percent = (this.event_config.max_reward_percent.sub(this.event_config.min_reward_percent)).plus(this.event_config.min_reward_percent).mul(Math.random());
    return {
      reward_percent,
      min_reward: this.event_config.min_reward,
      max_reward: this.event_config.max_reward,
      number_of_blocks_remaining: number_of_blocks - offset
    }
  },

  redeemEvent: function()
  {
    var event = this.getCurrentEvent();
    var ico = this.getActiveICO();
    var reward = ico.resources.value.mul(event.reward_percent);
    if(reward.lt(event.min_reward))
    {
      reward = event.min_reward;
    }
    else if(reward.gt(event.max_reward))
    {
      reward = event.max_reward;
    }
    reward = new SafeNumber(reward.toFixed(0));
    ico.resources = ico.resources.plus(reward);
    this.ico_id_to_ico.put(ico.id, ico);
    this.total_resources = this.total_resources.plus(reward);

    Event.Trigger("redeemEvent", {
      ico,
      event,
      reward
    });

    return reward;
  },
  //#endregion
  //#region Dapp calls
  getInfo: function(ticker)
  {
    var ico_id;
    if(ticker)
    {
      ico_id = this.ticker_to_ico_id.get(ticker);
    }
    else
    {
      var user = this.getOrCreateUser();
      ico_id = user.active_ico_id;
    }

    if(ico_id)
    {
      this.redeemResources(ico_id);
    }

    var items = [];
    var all_items = this.lists.get("all_items");
    
    for(var i = 0; i < all_items.length; i++)
    {
      items.push(this.getItem(all_items[i], ico_id));
    }
    
    var data = {
      smart_contract_balance: this.getSmartContractBalance(),
      sell_price_nas_per_resource: this.getSellPriceNasPerResource(),
      currentEvent: this.getCurrentEvent(),
      blocksTillNextEvent: this.getBlocksTillNextEvent(),
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
      if(user.nas_redeemed.lte(new SafeNumber(0)))
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
    ico.market_cap = ico.resources.plus(ico.total_production_rate.mul(time_passed));
    
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

//#region Helpers
function addToList(lists, list_name, item)
{
  if(item == null)
  {
    throw new Error("Adding null to a list? hmmm: " + item);
  }
  var list = lists.get(list_name);
  list.push(item);
  lists.put(list_name, list);
}

function removeFromList(lists, list_name, item)
{
  if(item == null)
  {
    throw new Error("Removing null from a list? hmmm: " + item);
  }
  var list = lists.get(list_name);
  var index = list.indexOf(item);
  if(index < 0)
  {
    throw new Error("Item not found?");
  }
  list.splice(index, 1);
  lists.put(list_name, list);
}

function assert(value, message)
{
  if(!value)
  {
    throw new Error("Failed assert: " + message);
  }
}

function isString(value, max_length)
{
  if(value == null)
  {
    return false;
  }

  if(!value instanceof String)
  {
    return false;
  }

  if(value.length <= 0)
  {
    return false;
  }

  return value.length <= max_length;
}

function isArray(value) 
{
  return value instanceof Array;
}
//#endregion