function VoterRegForm() {
  document.getElementById("candidateForm").style.display = "none";
  document.getElementById("voterForm").style.display = "block";
  document.getElementById("candidateContent").style.display = "none";
  document.getElementById("voterContent").style.display = "none";
  document.getElementById("voteForm").style.display = "none";
}

function CandidateRegForm() {
  document.getElementById("candidateForm").style.display = "block";
  document.getElementById("voterForm").style.display = "none";
  document.getElementById("candidateContent").style.display = "none";
  document.getElementById("voterContent").style.display = "none";
  document.getElementById("voteForm").style.display = "none";
}

function ShowCandidates() {
  document.getElementById("candidateForm").style.display = "none";
  document.getElementById("voterForm").style.display = "none";
  document.getElementById("candidateContent").style.display = "block";
  document.getElementById("voterContent").style.display = "none";
  document.getElementById("voteForm").style.display = "none";
}

function ShowVoters() {
  document.getElementById("candidateForm").style.display = "none";
  document.getElementById("voterForm").style.display = "none";
  document.getElementById("candidateContent").style.display = "none";
  document.getElementById("voterContent").style.display = "block";
  document.getElementById("voteForm").style.display = "none";
}

function VoteNow() {
  document.getElementById("candidateForm").style.display = "none";
  document.getElementById("voterForm").style.display = "none";
  document.getElementById("candidateContent").style.display = "none";
  document.getElementById("voterContent").style.display = "none";
  document.getElementById("voteForm").style.display = "block";
}
