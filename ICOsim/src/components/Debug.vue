<template>
  <div class='container-fluid'>
      <h1>Debug</h1>
      
<div id="status-card" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="status-card-title">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
      <div class="modal-body" id="status-card-content">
        Hi
      </div>
    </div>
  </div>
</div>

        <div class="card">
      <h5>Start ICO</h5>
      <div class="row mt-2">
        <div class="col">
            Name: <input id="name" type="text">
        </div>
        <div class="col">
            Ticker: <input id="ticker" type="text">
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
            <button v-on:click="startICO()">Start ICO</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
var game = require("../logic/game.js");

import Navbar from './Navbar.vue';
import FundsContainer from './FundsDisplay';

export default {
  name: 'Debug',
  data () {
    return {
      user_funds : 1000000
    }
  },
  components: {
    Navbar,
    FundsContainer
  },
  methods:
  {
      startICO,
  }

}

var status_cooldown;
function hideStatus()
{
    $("#status-card").modal('hide');    
}
function showStatus(title, message, timeout, onTimeout)
{
    if(status_cooldown)
    {
        clearTimeout(status_cooldown);
        status_cooldown = null;
    }

    $("#status-card-title").text(title);
    $("#status-card-content").empty();
    $("#status-card-content").append(message);
    $("#status-card").modal('show');

    if(timeout) 
    {
        status_cooldown = setTimeout(function() 
        {
            hideStatus();
            if(onTimeout)
            {
                onTimeout();
            }
        }, timeout);
    }
}

function onTxPosted(resp) 
{
    showStatus("Tx Posted", resp.txhash, 5000);
}

function onError(error)
{ // onError
    showStatus("Error", error, 15000);
}

function onSuccess(resp)
{ // onSuccess
    showStatus("Success", resp, 3000);
}

function startICO() 
{
    game.startICO($("#name").val(), $("#ticker").val(), onTxPosted, onSuccess, onError);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .card
    {
        background-color: white;
    }
</style>
