<template>
  <div class="container">
    <h1><span>{{classType}}</span> Electives</h1>
    <div v-if="currTriClassList && currTriClassList.length">
      <div class="row">
        <div class="col-sm-6">
          <div class="card" v-for="classInfo in currTriClassList">
            <div class="card-body">
              <div class="row">
                <div class="col-sm">
                  <h5 class="card-title mt-2">{{classInfo.name}}</h5>
                </div>
                <div v-if="classInfo.current_students.length >= classInfo.max_student_count" class="col-sm text-right">
                  <div class="btn btn-danger">Class Full</div>
                </div>
              </div>
              <p class="card-text mt-3">{{classInfo.description}}</p>

              <div v-bind:class="[classInfo.current_students.length >= classInfo.max_student_count ? 'maxStudents' : 'open']">
                <div class="row">
                  <div class="form-group col-md">
                    <label for="newStuFirstName">First Name</label>
                    <input id="newStuFirstName" type="text" v-model="studentInfo.firstName" class="form-control">
                  </div>
                  <div class="form-group col-md">
                    <label for="newStuLastName">Last Name</label>
                    <input id="newStuLastName" type="text" v-model="studentInfo.lastName" class="form-control">
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-md">
                    <label for="newStuFirstName">Student Id</label>
                    <input id="newStuFirstName" type="text" v-model="studentInfo.studentId" class="form-control">
                  </div>
                  <div class="form-group col-md">
                    <label for="newStuLastName">Advisor</label>
                    <select class="form-control" v-model="studentInfo.advisorId">
                      <option v-for="advisor in advisorList" :key="advisor.id" :value=advisor.id>{{advisor.firstName}} {{advisor.lastName}}</option>
                    </select>
                  </div>
                </div>
                <div v-if="classInfo.current_students.length < classInfo.max_student_count" class="text-right">
                  <button type="button" class="btn btn-primary" @click="electiveSignup(classInfo.id)" :disabled="isDisabled()">Signup</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  methods: {
    getAllOfType: function(type) {
      let formData = new FormData();
      let self = this;
      formData.append('searchTable', type)

      axios.post(this.hostName+'/teacher-tool/getTable.php',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function(data){
          if(type === 'class'){
            self.classList = data.data;
          }else{
            self.advisorList = data.data;
          }
        }).catch(function(e){console.warn('FAILURE!!',e);});
    },
    getCurrentTrimester: function(){
      let self = this;
      let formData = new FormData();
      formData.append('classType', this.classType)

      axios.post(this.hostName+'/teacher-tool/getCurrentTrimesterDetail.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        self.currentTrimester = data.data.currTri;
        self.currTriClassList = data.data.info;
      }).catch(function(e){console.warn('FAILURE!!',e);});
    },
    rData: function(){
      this.getCurrentTrimester();
      this.getAllOfType('advisor');
    }
  },
  created(){
    let self = this;
    this.dataGrabTimer = window.setInterval(function(){
      self.rData();
    }, 4000);
  },
  beforeMount(){
    this.getCurrentTrimester();
    this.getAllOfType('advisor');
  },
  data: function () {
    return {
      methods:{
        
      },
      hostName: (process.env.NODE_ENV === 'development') ? 'http://localhost:8888' : 'http://the1johnson.com',
      currentTrimester: null,
      currTriClassList: null,
      advisorList: null,
      classType: this.$route.params.retClassType === 'senior' ? 'senior' : 'prep',
      studentInfo: {
        firstName: '',
        lastName: '',
        studentId: '',
        advisorId: false
      },
      showMessage: function(displayMsg){
        this.$bvToast.toast(displayMsg, {
          title: 'Class Status',
          autoHideDelay: 4000,
          appendToast: false
        })
      },
      electiveSignup: function(classId){
        let formData = new FormData();
        let self = this;
        formData.append('classId', classId)
        formData.append('studentFirstName', this.studentInfo.firstName)
        formData.append('studentLastName', this.studentInfo.lastName)
        formData.append('studentId', this.studentInfo.studentId)
        formData.append('advisorId', this.studentInfo.advisorId)

        axios.post(this.hostName+'/teacher-tool/electiveSignup.php',
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
          ).then(function(data){
            if(data.data.msg){
              alert(data.data.msg)
              //self.showMessage(data.data.msg);
            }
            //console.log(data.data)
            self.getCurrentTrimester();
          }).catch(function(e){console.warn('FAILURE!!',e);});
      },
      isDisabled: function() {
        return (this.studentInfo.firstName.length > 2 && this.studentInfo.lastName.length > 2 && this.studentInfo.studentId.length > 3 && this.studentInfo.advisorId) ? false : true;
      }
    }
  }

}
</script>
