<template>
  <div class="reportPin">
    <div class="content">
      <h5 class="title">Report Pin</h5>
      <div class="firstPage" v-if="showOptions == true">
        <div class="options">
          <ul class="spamList">
            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span class="radioControl" @click="showSpam"></span>
                </span>
                <span class="radioLabel">Spam</span>
              </label>
              <p>Misleading or repetitive posts</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span class="radioControl" @click="showSelfHarm"></span>
                </span>
                <span class="radioLabel"> Self-harm</span>
              </label>
              <p>Eating disorders, cutting, suicide</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span class="radioControl" @click="showMisinformation"></span>
                </span>
                <span class="radioLabel"> Misinformation</span>
              </label>
              <p>Health misinformation or conspiracies</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span
                    class="radioControl"
                    @click="showHatefulActivities"
                  ></span>
                </span>
                <span class="radioLabel"> Hateful activities</span>
              </label>
              <p>Prejudice, stereotypes, white supremacy</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span class="radioControl" @click="showDangerousGoods"></span>
                </span>
                <span class="radioLabel"> Dangerous goods</span>
              </label>
              <p>Drugs, weapons, regulated products</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span
                    class="radioControl"
                    @click="showPrivacyViolations"
                  ></span>
                </span>
                <span class="radioLabel">
                  Harassment or privacy violations</span
                >
              </label>
              <p>Insults, threats, personally identifiable info</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span
                    class="radioControl"
                    @click="showGraphicViolence"
                  ></span>
                </span>
                <span class="radioLabel"> Graphic violence</span>
              </label>
              <p>Violent images or promotion of violence</p>
            </li>

            <li>
              <label class="radio">
                <span class="radioInput">
                  <input type="radio" name="option" value="option" />
                  <span class="radioControl" @click="showMyProperty"></span>
                </span>
                <span class="radioLabel"> My intellectual property</span>
              </label>
              <p>Copyright or trademark infringement</p>
            </li>
          </ul>
        </div>
        <div class="reportPinBtns">
          <button class="optionsBtns" id="cancelButton" @click="closePopUp">
            Cancel
          </button>
          <button
            class="optionsBtns"
            id="nextButton"
            disabled
            @click="moveToNextPage"
          >
            Next
          </button>
        </div>
      </div>
      <div class="secondPage" v-if="showReportMsg == true">
        <div class="spamMsg" v-if="spam == true">
          <h2>Report spam?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">Misleading content or behavior</li>
            <li class="msg">Repetitive posts</li>
            <li class="msg">Unsolicited commercial messages</li>
          </ul>
        </div>

        <div class="selfHarmMsg" v-if="selfHarm == true">
          <h2>Report self-harm?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">
              Encouraging self-mutilation, eating disorders and drug abuse
            </li>
            <li class="msg">Graphic depictions of self-harm</li>
          </ul>
          <p>
            Note: We may send support resources to the person who saved this
            Pin.
          </p>
        </div>

        <div class="misinformationMsg" v-if="Misinformation == true">
          <h2>Report Misinformation?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">False cures for cancer and terminal illnesses</li>
            <li class="msg">Anti-vaccination advice</li>
          </ul>
          <h6>We don't remove things such as</h6>
          <ul>
            <li class="msg">
              Tips for using teas, oils or herbs to improve sleep
            </li>
            <li class="msg">
              Healthy eating content, including cleanses and supplements
            </li>
          </ul>
        </div>

        <div class="hatefulActivitiesMsg" v-if="hatefulActivities == true">
          <h2>Report hateful activities?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">Attacks or slurs directed at protected groups</li>
            <li class="msg">Hate groups and white supremacy</li>
          </ul>
          <h6>We don't remove things such as</h6>
          <ul>
            <li class="msg">Images collected out of historical interest</li>
            <li class="msg">Images from movies and other entertainment</li>
          </ul>
        </div>

        <div class="dangerousGoods" v-if="dangerousGoods == true">
          <h2>Report dangerous goods?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">
              Private people offering to sell, purchase or trade drugs, weapons,
              etc.
            </li>
            <li class="msg">Promotion of drug use</li>
            <li class="msg">Sale of endangered species or their parts</li>
            <li class="msg">
              Instructions for creating lethal substances or weapons
            </li>
          </ul>
        </div>

        <div class="privacyViolations" v-if="privacyViolations == true">
          <h2>Report harassment or privacy violations?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">Attacks directed at private people</li>
            <li class="msg">
              The posting or sharing of personally identifiable information
            </li>
          </ul>
          <h6>We don't remove things such as</h6>
          <ul>
            <li class="msg">Criticisms made by news organizations</li>
            <li class="msg">Information on public record</li>
          </ul>
        </div>

        <div class="graphicViolence" v-if="graphicViolence == true">
          <h2>Report graphic violence?</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">Extreme graphic violence</li>
            <li class="msg">Glorification or promotion of violence</li>
            <li class="msg">Threats of physical harm</li>
          </ul>
          <h6>We don't remove things such as</h6>
          <ul>
            <li class="msg">Historical, educational or newsworthy content</li>
            <li class="msg">
              Political protests, advocacy or other social causes
            </li>
          </ul>
        </div>

        <div class="myProperty" v-if="myProperty == true">
          <h2>Report My intellectual property</h2>
          <h6>We remove things such as</h6>
          <ul>
            <li class="msg">Pin infringes my copyright</li>
            <li class="msg">Pin infringes my trademark</li>
          </ul>
        </div>

        <div class="reportPinBtns">
          <button class="optionsBtns" @click="backToFirstPage">Back</button>
          <button class="optionsBtns" id="reportBtn" @click="reportPin">
            Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/RadioButtons";
@import "../scss/Colors";
@import "../scss/Mixins";
.reportPin {
  @include popUpBackground;
}
.title {
  @include popUpTitle;
  margin-bottom: 30px;
}
.content {
  @include popUpContent;
  margin-top: 50px;
  padding-left: 1px;
  padding-right: 1px;
  width: 35%;
}
.options {
  height: 440px;
  overflow-y: auto;
}
.spamList {
  list-style: none;
}
ul {
  padding: 0;
  margin: 0;
}
li {
  padding-left: 15px;
  border-bottom: 1px solid rgba(185, 183, 183, 0.5);
}
.msg {
  border: none;
  padding: 0;
  margin-left: 40px;
}
p {
  padding-left: 25px;
  margin-bottom: 7px;
  font-size: 14px;
}
h2,
h6 {
  margin-left: 20px;
  font-weight: 700;
}
button:focus {
  outline: 0 !important;
}
.optionsBtns {
  margin-top: 20px;
  margin-left: 8px;
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  font-weight: 700;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 60px;
  &:hover {
    background-color: $darkBlue;
    opacity: 1;
  }
}
#cancelButton {
  width: 70px;
}
#nextButton {
  background-color: rgba(187, 184, 184, 0.5);
  color: rgb(136, 134, 134);
}
#reportBtn {
  width: 72px;
}
.reportPinBtns {
  display: flex;
  justify-content: flex-end;
  margin-right: 27px;
}
@media screen and (max-width: 1320px) {
  .content {
    width: 40%;
  }
}
@media screen and (max-width: 1100px) {
  .content {
    width: 47%;
  }
}
@media screen and (max-width: 970px) {
  .content {
    width: 55%;
  }
}
@media screen and (max-width: 750px) {
  .content {
    width: 75%;
  }
}
@media screen and (max-width: 500px) {
  .content {
    width: 82%;
  }
}
@media screen and (max-width: 420px) {
  .content {
    width: 95%;
  }
}
</style>

<script>
import { mapState } from "vuex";
export default {
  name: "ReportPin",
  data: function() {
    return {
      showOptions: true,
      showReportMsg: false,
      spam: false,
      selfHarm: false,
      Misinformation: false,
      hatefulActivities: false,
      dangerousGoods: false,
      privacyViolations: false,
      graphicViolence: false,
      myProperty: false,
      reason: ""
    };
  },
  computed: {
    ...mapState({
      CardId: state => state.homeCards.CardId
    })
  },
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleReportPinPopUp");
    },
    backToFirstPage() {
      this.showOptions = true;
      this.showReportMsg = false;
      setTimeout(() => {
        const nextButton = document.getElementById("nextButton");
        nextButton.setAttribute("disabled", "true");
        nextButton.style = "default";
      }, 50);
    },
    moveToNextPage() {
      this.showOptions = false;
      this.showReportMsg = true;
    },
    reportPin() {
      let reportReason = {
        reason: this.reason
      };
      this.$store.dispatch("homeCards/reportPin", {
        pinId: this.CardId,
        reportReason
      });
      this.$store.commit("popUpsState/toggleReportPinPopUp");
    },
    nextButtonStyle() {
      const nextButton = document.getElementById("nextButton");
      nextButton.removeAttribute("disabled");
      nextButton.style.backgroundColor = "#485b66";
      nextButton.style.color = "white";
    },
    showSpam() {
      (this.spam = true),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Spam";
    },
    showSelfHarm() {
      (this.spam = false),
        (this.selfHarm = true),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Self-Harm";
    },
    showMisinformation() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = true),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Misinformation";
    },
    showHatefulActivities() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = true),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Hateful-Activities";
    },
    showDangerousGoods() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = true),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Dangerous goods";
    },
    showPrivacyViolations() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = true),
        (this.graphicViolence = false),
        (this.myProperty = false);
      this.reason = "Privacy Violations";
    },
    showGraphicViolence() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = true),
        (this.myProperty = false);
      this.reason = "Graphic Violence";
    },
    showMyProperty() {
      (this.spam = false),
        (this.selfHarm = false),
        (this.Misinformation = false),
        (this.hatefulActivities = false),
        (this.dangerousGoods = false),
        (this.privacyViolations = false),
        (this.graphicViolence = false),
        (this.myProperty = true);
      this.reason = "My intellectual property";
    }
  },
  mounted() {
    const radioBtnList = document.querySelectorAll(".radioInput");
    for (let i = 0; i < radioBtnList.length; i++) {
      radioBtnList[i].addEventListener("click", this.nextButtonStyle);
    }
  },
  watch: {
    showOptions() {
      if (this.showOptions === true) {
        setTimeout(() => {
          const radioBtnList = document.querySelectorAll(".radioInput");
          for (let i = 0; i < radioBtnList.length; i++) {
            radioBtnList[i].addEventListener("click", this.nextButtonStyle);
          }
        }, 200);
      } else {
        const radioBtnList = document.querySelectorAll(".radioInput");
        for (let i = 0; i < radioBtnList.length; i++) {
          radioBtnList[i].removeEventListener("click", this.nextButtonStyle);
        }
      }
    }
  }
};
</script>
