BigNumber.config({ DECIMAL_PLACES: 10, ROUNDING_MODE: 1 })

var Contract = function() 
{
  // all_users, all_items
  LocalContractStorage.defineMapProperty(this, "lists");

  // {resources, nas_redeemed, last_action_date, items: {'Pick Axe': 2, 'Shield': 1}}
  LocalContractStorage.defineMapProperty(this, "addr_to_user");
  
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
  //#region Owner only
  init: function(starting_resources) 
  {
    this.lists.put("all_users", []);
    this.lists.put("all_items", []);
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
    assertIsOwner(this);

    this.starting_resources = new BigNumber(starting_resources);
    if(!this.starting_resources.isInteger()
      || this.starting_resources.lt(1))
    {
      throw new Error("Invalid amount: " + this.starting_resources + " from (" + starting_resources + ")");
    }
  },
  
  setWorldResources : function(world_resources)
  {
    assertIsOwner(this);

    this.world_resources = new BigNumber(world_resources);
    if(!this.world_resources.isInteger())
    {
      throw new Error("Invalid amount: " + this.world_resources + " from (" + world_resources + ")");
    }
  },

  setBuyPrice : function(nas_per_resource)
  {
    assertIsOwner(this);

    this.buy_price_nas_per_resource = nas_per_resource;
  },
  
  isOwner: function()
  {
    return this.owner_addr == Blockchain.transaction.from;
  },
  
  changeOwner: function(new_owner_addr)
  {
    assertIsOwner(this);

    if(!Blockchain.verifyAddress(new_owner_addr))
    {
      throw new Error("What are you changing the address to? You entered: " + new_owner_addr);
    }

    this.owner_addr = new_owner_addr;
  },
  
  createItem: function(item)
  {
    assertIsOwner(this);

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
        resources: this.starting_resources, 
        nas_redeemed: new BigNumber(0), 
        last_action_date: Date.now(), 
        items: {}
      };
      this.addr_to_user.put(Blockchain.transaction.from, user);
      var all_users = this.lists.get("all_users");
      all_users.push(Blockchain.transaction.from);
      this.lists.put("all_users", all_users);
      this.total_resources = this.total_resources.plus(this.starting_resources);
    }
    return user;
  },
  //#endregion

  //#region Resource and Money management
  accept: function() 
  {
    var user = this.getOrCreateUser();
    var amount = Blockchain.transaction.value.div(this.buy_price_nas_per_resource);
    this.total_resources = this.total_resources.plus(amount);
    user.resources = new BigNumber(user.resources).plus(amount);
    this.addr_to_user.put(Blockchain.transaction.from, user);
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
    var user = this.getOrCreateUser();
    return new BigNumber(user.resources).plus(this.getMyPendingResources());
  },

  getMyResourcesNasValue: function()
  {
    var user = this.getOrCreateUser();
    if(Object.keys(user.items).length < 1)
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
    var user = this.getOrCreateUser();
    var count = user.items[name];
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

  getMyProductionSinceLastRedeem: function()
  {
    var user = this.getOrCreateUser();

    var time_passed = Date.now() - user.last_action_date;
    if(time_passed < 0)
    {
      time_passed = 0;
    }
    time_passed = new BigNumber(time_passed).div(1000); // to seconds

    return this.getMyProductionRate().mul(time_passed);
  },

  getMyItemBonus: function(name)
  {
    var item = this.getItemRaw(name);
    if(!item.bonus_multiplier)
    {
      return null;
    }
    var user = this.getOrCreateUser();
    var count = user.items[name];
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
    var user = this.getOrCreateUser();
    user.last_action_date = Date.now();
    user.resources = new BigNumber(user.resources).plus(pending_resources);
    this.total_resources = this.total_resources.plus(pending_resources);
    this.addr_to_user.put(Blockchain.transaction.from, user);

    return user.resources;
  },

  redeemNas: function()
  {
    var user = this.getOrCreateUser();
    var nas = new BigNumber(this.getMyResourcesNasValue().toFixed(0));
    this.total_resources = this.total_resources.sub(user.resources).plus(this.starting_resources);
    user.resources = new BigNumber(this.starting_resources);
    user.items = {};
    user.nas_redeemed = new BigNumber(user.nas_redeemed).plus(nas);
    this.addr_to_user.put(Blockchain.transaction.from, user);
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

    item.user_holdings = this.getMyItemCount(name);
    item.user_price = this.getMyItemPrice(name, 1);
    item.user_item_production = this.getMyItemProductionRate(name);
    item.user_item_bonus = this.getMyItemBonus(name);
    item.user_max_can_afford = this.getMaxICanAfford(name);

    return item;
  },
  
  getMyItemCount: function(name)
  {
    var user = this.getOrCreateUser();
    var my_count = user.items[name];
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
    return new BigNumber(item.start_price).mul(multiple);
  },

  getMaxICanAfford: function(name)
  {
    this.redeemResources();
    var item = this.getItemRaw(name);
    var user = this.getOrCreateUser();

    var p = new BigNumber(user.resources);
    var s = new BigNumber(item.start_price);
    var c = this.getMyItemCount(name);

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
    var user = this.getOrCreateUser();

    if(!quantity)
    { 
      quantity = this.getMaxICanAfford(name);
    }

    var price = this.getMyItemPrice(name, quantity);
    if(price.gt(user.resources))
    {
      throw new Error("You can't afford that yet.  You have " + user.resources + " but it costs " + price);
    }
    
    user.resources = new BigNumber(user.resources).sub(price); 
    this.total_resources = this.total_resources.sub(price);
    if(!user.items[name])
    {
      user.items[name] = quantity;
    }
    else
    {
      user.items[name] = new BigNumber(user.items[name]).plus(quantity);
    }

    this.addr_to_user.put(Blockchain.transaction.from, user);
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

    return {
      smart_contract_balance: this.getSmartContractBalance(),
      buy_price_nas_per_resource: this.getBuyPriceNasPerResource(),
      sell_price_resources_per_nas: this.getSellPriceResourcesPerNas(),
      my_resources: this.getMyResources(),
      my_resources_nas_value: this.getMyResourcesNasValue(),
      my_production_rate: this.getMyProductionRate(),
      my_bonus: this.getMyBonus(),
      items
    }
  },
  //#endregion
}

module.exports = Contract

function assertIsOwner(contract)
{
  if(!contract.isOwner())
  {
    throw new Error("This is an owner only call.");
  }
}
