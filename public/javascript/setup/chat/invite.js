import { displayWaitingList } from "./events.js"

const initInvite = () => {
  $('#invitation').text(username + " has invited you to join a group chat at: " + window.location + "?inviter=" + username)
  $('#copyInviteButton').on('click', () => {
    $('#inviteModalButton').hide()
    let text = document.getElementById("invitation").textContent;
    navigator.clipboard.writeText(text)
    $('#inviteChatModal').modal('hide')
    $('#copiedText').show();
    setTimeout(function(){
      $('#inviteModalButton').show()
      $('#copiedText').hide();
    }, 5000)
  })
}

$('.modal').on('hidden.bs.modal', function () {
  displayWaitingList();
})
export { initInvite }
