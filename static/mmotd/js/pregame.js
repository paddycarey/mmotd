/**
 * Javascript for the pregame/chat page
 */


// compile handlebars templates ahead of time
var message_template = Handlebars.compile($("#message-template").html());


// router function that runs the correct callback when a message is received
// over the channel API, possible message types are, 'chat', 'user_joined',
// 'user_left' and 'status_update'
dispatchMessage = function(m) {
  context = JSON.parse(m.data);
  if (context.msgtype === 'chat') {
    chatMessage(context.msgcontent);
  } else if (context.msgtype === 'status_update') {
    statusUpdateMessage(context.msgcontent);
  }
}


// function that adds a message to the chat
// pane when one is receieved over the channel
chatMessage = function(message) {
  $('#chat-well').append(message_template(message));
  $('#chat-well').animate({ scrollTop: $('#chat-well').prop("scrollHeight") - $('#chat-well').height() }, 50);
}

replayChat = function(){
  sendMessage(replay_chat_url, {replay_chat: true});
}

// function that updates a players status when a
//change is received over the channel api
statusUpdateMessage = function(message) {
  if (message.status === true) {
    $('#ready-a-' + message.user_id).removeClass('btn-danger').addClass('btn-success');
    $('#ready-span-' + message.user_id).removeClass('glyphicon-remove').addClass('glyphicon-ok');
  } else {
    $('#ready-a-' + message.user_id).removeClass('btn-success').addClass('btn-danger');
    $('#ready-span-' + message.user_id).removeClass('glyphicon-ok').addClass('glyphicon-remove');
  }
}


// displays an error message when something goes wrong with the socket and
// allows the user to refresh and reconnect
channelError = function() {
  alert('Something went wrong with the channel API socket, the page will now reload so you can reconnect');
  window.location.reload();
}


// opens a socket over the channel API and attaches
// the correct callbacks to its signals
openChannel = function() {
  channel = new goog.appengine.Channel(channel_token);
  socket = channel.open();
  socket.onopen = replayChat;
  socket.onmessage = dispatchMessage;
  socket.onerror = channelError;
  socket.onclose = channelError;
}


sendMessage = function(path, data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', path, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.send(JSON.stringify(data));
};


function processForm(e) {

  // prevent default form action
  if (e.preventDefault) {
    e.preventDefault();
  }

  // build template context, render the template and append the result to our chat pane
  context = {message: $('#chat-input').val(), nickname: user_nickname}
  // send chat message to other connected clients
  sendMessage(chat_url, context);

  // reset the chat box back to empty
  $('#chat-input').val('')

  // return false to prevent the default form behavior
  return false;

}


function processStatusChange(e) {

  // prevent default form action
  if (e.preventDefault) {
    e.preventDefault();
  }

  // build template context, render the template and append the result to our chat pane
  context = {status: !$("#ready-a-" + user_id).hasClass('btn-success')}
  // send chat message to other connected clients
  sendMessage(status_update_url, context);

  // return false to prevent the default form behavior
  return false;

}


$(document).ready(function(){

  // open a channel and display channel welcome message
  openChannel();

  // attach a callback to chat input
  var form = document.getElementById('chat-form');
  if (form.attachEvent) {
    form.attachEvent("submit", processForm);
  } else {
    form.addEventListener("submit", processForm);
  }

  // attach a click event to the user's own status button
  var ready_button = document.getElementById("ready-a-" + user_id);
  if (ready_button.attachEvent) {
    ready_button.attachEvent("click", processStatusChange);
  } else {
    ready_button.addEventListener("click", processStatusChange);
  }

});
