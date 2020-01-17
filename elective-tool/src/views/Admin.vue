<template>
  <div class="admin container">
    
    <div v-if="adminLoggedIn">
      <h1 class="mt-3">Admin</h1>
      <div class="mt-3" v-if="currTriClassList && currTriClassList.length">
        <h2>{{currentTrimester}} Class List <button class="btn" @click="dlExcel"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></button></h2>
        <div class="row">
          <div class="col-sm">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Academy</th>
                  <th>Current/Max</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(classInfo, index) in currTriClassList" :class="index === viewClassStudents ? 'table-info' : ''" @click="setViewStudents(index)">
                  <td>{{classInfo.name}}</td>
                  <td>{{classInfo.academy}}</td>
                  <td>{{classInfo.current_students.length}}/{{classInfo.max_student_count}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm" v-if="viewClassStudents !== false">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Id</th>
                  <th>Advisor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(studentInfo, index) in currTriClassList[viewClassStudents].current_students">
                  <td>{{studentInfo.first_name}}</td>
                  <td>{{studentInfo.last_name}}</td>
                  <td>{{studentInfo.student_id}}</td>
                  <td>{{getAdvisorInfo(studentInfo.advisor_id)}}</td>
                  <td>
                    <b-button v-b-modal.modal-editElectiveSingup variant="btn-link" @click="setEditElective(index)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg></b-button>
                    <b-button variant="btn-link" @click="deleteEletiveStudent(index)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg></b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      

      <div class="row mt-3">
        
        <div class="col-sm">
          <h2>Class List</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Trimester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(classInfo, index) in classList">
                <td>{{classInfo.name}}</td>
                <td>{{classInfo.year}}</td>
                <td>{{classInfo.trimester}}</td>
                <td>
                  <button class="btn" @click="dlExcel(classInfo.id)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></button>
                  <b-button v-b-modal.modal-editClass variant="btn-link" @click="setEditClass(index)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg></b-button>
                </td>
              </tr>
            </tbody>
          </table>
          <b-button v-b-modal.modal-addClass variant="outline-dark">Add Class</b-button>
        </div>


        <div class="col-sm">
          <h2>Advisor List</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(advisorInfo, index) in advisorList">
                <td>{{advisorInfo.firstName}} {{advisorInfo.lastName}}</td>
                <td>
                  <b-button v-b-modal.modal-editAdvisor @click="setEditAdvisor(index)" variant="btn-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>

          <b-button v-b-modal.modal-addAdvisor variant="outline-dark">Add Advisor</b-button>
        </div>

      </div>
    </div>
    <div v-else>
      <h1 class="mt-3">Admin Login</h1>
      <div class="row mt-3">
        <div class="col-8">
          <b-form-input id="adminPassword" type="password" v-model="adminPassword" placeholder="Password"></b-form-input>
        </div>
        <div class="col-4">
          <b-button @click="loginToAdmin" variant="primary btn-block">Submit</b-button>
        </div>
      </div>
    </div>



    <b-modal id="modal-addAdvisor" title="Add New Advisor" hide-footer>
      <b-container fluid>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newAdvisorFirstName">First Name</label>
            <b-form-input id="newAdvisorFirstName" v-model="newAdvisor.firstName" placeholder="First Name"></b-form-input>
          </div>
          <div class="form-group col-md-6">
            <label for="newAdvisorLastName">Last Name</label>
            <b-form-input id="newAdvisorLastName" v-model="newAdvisor.lastName" placeholder="Last Name"></b-form-input>
          </div>
        </div>

        <div class="text-right">
          <b-button @click="$bvModal.hide('modal-addClass')" variant="danger">Cancel</b-button>
          <b-button @click="addNewAdvisor" class="ml-2" variant="primary">Submit</b-button>
        </div>
      </b-container>
    </b-modal>
    <b-modal id="modal-addClass" title="Add New Class" hide-footer>
      <b-container fluid>
        <div class="form-group">
          <label for="newClassName">Name</label>
          <b-form-input id="newClassName" v-model="newClass.name" placeholder="Name"></b-form-input>
        </div>
        <div class="form-group">
          <label for="newClassDescription">Description</label>
          <b-form-textarea id="newClassDescription" v-model="newClass.description" placeholder="Description"></b-form-textarea>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newClassTrimester">Trimester</label>
            <b-form-select id="newClassTrimester" v-model="newClass.trimester" :options="trimesterList"></b-form-select>
          </div>
          <div class="form-group col-md-6">
            <label for="newClassYear">Year</label>
            <b-form-input id="newClassYear" v-model="newClass.year" placeholder="Year"></b-form-input>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newClassAcademy">Academy</label>
            <b-form-select id='newClassAcademy' v-model="newClass.academy" :options="academyList"></b-form-select>
          </div>
          <div class="form-group col-md-6">
            <label for="newClassStudents">Max Students</label>
            <b-form-input id="newClassStudents" v-model="newClass.studentCount" placeholder="Max Students"></b-form-input>
          </div>
        </div>
        <div class="text-right">
          <b-button @click="$bvModal.hide('modal-addClass')" variant="danger">Cancel</b-button>
          <b-button @click="addNewClass" class="ml-2" variant="primary">Submit</b-button>
        </div>
      </b-container>
    </b-modal>

    <b-modal id="modal-editAdvisor" title="Edit Advisor" hide-footer>
      <b-container fluid>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newAdvisorFirstName">First Name</label>
            <b-form-input id="newAdvisorFirstName" v-model="editAdvisorObj.firstName" placeholder="First Name"></b-form-input>
          </div>
          <div class="form-group col-md-6">
            <label for="newAdvisorLastName">Last Name</label>
            <b-form-input id="newAdvisorLastName" v-model="editAdvisorObj.lastName" placeholder="Last Name"></b-form-input>
          </div>
        </div>

        <div class="text-right">
          <b-button @click="$bvModal.hide('modal-editAdvisor')" variant="danger">Cancel</b-button>
          <b-button @click="editAdvisor" class="ml-2" variant="success">Save</b-button>
        </div>
      </b-container>
    </b-modal>
    <b-modal id="modal-editElectiveSingup" title="Edit Elective Singup" hide-footer>
      <b-container fluid>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="esEditFName">First Name</label>
            <b-form-input id="esEditFName" v-model="editElectiveObj.firstName" placeholder="First Name"></b-form-input>
          </div>
          <div class="form-group col-md-6">
            <label for="esEditLName">Last Name</label>
            <b-form-input id="esEditLName" v-model="editElectiveObj.lastName" placeholder="Last Name"></b-form-input>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="esEditsId">Student Id</label>
            <b-form-input id="esEditsId" v-model="editElectiveObj.studentId" placeholder="First Name"></b-form-input>
          </div>
          <div class="form-group col-md-6">
            <label for="esEditAdvisor">Advisor</label>
            <b-form-select id="esEditAdvisor" v-model="editElectiveObj.advisorId" :options="advisorOptList"></b-form-select>
          </div>
        </div>

        <div class="text-right">
          <b-button @click="$bvModal.hide('modal-editElectiveSingup')" variant="danger">Cancel</b-button>
          <b-button @click="editElectiveSingup" class="ml-2" variant="success">Save</b-button>
        </div>
      </b-container>
    </b-modal>
    <b-modal id="modal-editClass" title="Edit Class" hide-footer>
      <b-container fluid>
        <div class="form-group">
          <label for="newClassName">Name</label>
          <b-form-input id="newClassName" v-model="editClassObj.name" placeholder="Name"></b-form-input>
        </div>
        <div class="form-group">
          <label for="newClassDescription">Description</label>
          <b-form-textarea id="newClassDescription" v-model="editClassObj.description" placeholder="Description"></b-form-textarea>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newClassTrimester">Trimester</label>
            <b-form-select id="newClassTrimester" v-model="editClassObj.trimester" :options="trimesterList"></b-form-select>
          </div>
          <div class="form-group col-md-6">
            <label for="newClassYear">Year</label>
            <b-form-input id="newClassYear" v-model="editClassObj.year" placeholder="Year"></b-form-input>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="newClassAcademy">Academy</label>
            <b-form-select id='newClassAcademy' v-model="editClassObj.academy" :options="academyList"></b-form-select>
          </div>
          <div class="form-group col-md-6">
            <label for="newClassStudents">Max Students</label>
            <b-form-input id="newClassStudents" v-model="editClassObj.studentCount" placeholder="Max Students"></b-form-input>
          </div>
        </div>
        <div class="text-right">
          <b-button @click="$bvModal.hide('modal-editClass')" variant="danger">Cancel</b-button>
          <b-button @click="editClass" class="ml-2" variant="success">Save</b-button>
        </div>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    addNewClass: function() {
      let formData = new FormData();
      let self = this;

      for (const property in this.newClass) {
          formData.append(property, this.newClass[property])
      }

      axios.post(this.hostName+'/teacher-tool/addClass.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        //console.log(data.data);
        self.getAllOfType('class')
        self.$bvModal.hide('modal-addClass')
        alert('Class Added')
      }).catch(function(){
        console.log('FAILURE!!')
      })
    },
    setViewStudents: function(classId) {
      this.viewClassStudents = classId;
    },
    addNewAdvisor: function() {
      let formData = new FormData();
      let self = this;

      for (const property in this.newAdvisor) {
          formData.append(property, this.newAdvisor[property])
      }
      
      axios.post(this.hostName+'/teacher-tool/addAdvisor.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        self.getAllOfType('advisor');
        self.$bvModal.hide('modal-addAdvisor')
        alert('Advisor Added');
        //console.log(data.data);
      }).catch(function(e){
        console.log('FAILURE!!', e);
      });
    },
    editClass: function() {
      let formData = new FormData();
      let self = this;

      formData.append('classId', this.editClassObj.classId)
      for (const property in this.editClassObj) {
          formData.append(property, this.editClassObj[property])
      }
      axios.post(this.hostName+'/teacher-tool/editClass.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        self.getAllOfType('class');
        self.$bvModal.hide('modal-editClass');
        //console.log(data.data);
      }).catch(function(e){
        console.log('FAILURE!!', e);
      });
    },
    editAdvisor: function() {
      let formData = new FormData();
      let self = this;

      formData.append('advisorId', this.editAdvisorObj.advisorId)
      for (const property in this.editAdvisorObj) {
          formData.append(property, this.editAdvisorObj[property])
      }
      axios.post(this.hostName+'/teacher-tool/editAdvisor.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        self.getAllOfType('advisor');
        self.$bvModal.hide('modal-editAdvisor');
        console.log(data.data);
      }).catch(function(e){
        console.log('FAILURE!!', e);
      });
    },
    editElectiveSingup: function(){
      let formData = new FormData();
      let self = this;

      for (const property in this.editElectiveObj) {
          formData.append(property, this.editElectiveObj[property])
      }
      axios.post(this.hostName+'/teacher-tool/editElectiveSingup.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
      ).then(function(data){
        self.getCurrentTrimester();
        self.$bvModal.hide('modal-editElectiveSingup');
        //console.log(data.data);
      }).catch(function(e){
        console.log('FAILURE!!', e);
      });
    },
    setEditAdvisor: function(advisorIndex){
      this.editAdvisorObj.advisorId = this.advisorList[advisorIndex].id
      this.editAdvisorObj.firstName = this.advisorList[advisorIndex].firstName;
      this.editAdvisorObj.lastName = this.advisorList[advisorIndex].lastName;
    },
    setEditClass: function(classIndex){
      this.editClassObj.classId = this.classList[classIndex].id
      this.editClassObj.name = this.classList[classIndex].name
      this.editClassObj.description = this.classList[classIndex].description
      this.editClassObj.trimester = this.classList[classIndex].trimester
      this.editClassObj.academy = this.classList[classIndex].academy
      this.editClassObj.studentCount = this.classList[classIndex].student_count
      this.editClassObj.year = this.classList[classIndex].year
    },
    setEditElective: function(electiveIndex){
      this.editElectiveObj.signup_id = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].signup_id
      this.editElectiveObj.classId = this.currTriClassList[this.viewClassStudents].id;
      this.editElectiveObj.advisorId = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].advisor_id
      this.editElectiveObj.studentId = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].student_id
      this.editElectiveObj.firstName = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].first_name
      this.editElectiveObj.lastName = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].last_name
    },
    deleteEletiveStudent: function(electiveIndex){
      let fName = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].first_name
      let lName = this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].last_name
      let cName = this.currTriClassList[this.viewClassStudents].name

      if (window.confirm('Are you sure you want to remove '+fName+' '+lName+' from '+cName)) { 
        let formData = new FormData();
        let self = this;
        formData.append('deleteId', this.currTriClassList[this.viewClassStudents].current_students[electiveIndex].signup_id)

        axios.post(this.hostName+'/teacher-tool/deleteElectiveSignup.php',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function(data){
          self.getCurrentTrimester();
          alert(fName+' '+lName+' removed from '+cName)
        }).catch(function(e){console.warn('FAILURE!!',e);});
      }
    },
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
          self.buildAdvisorOptList()
        }
      }).catch(function(e){console.warn('FAILURE!!',e);});
    },
    getCurrentTrimester: function(){
      let self = this;

      axios.get(this.hostName+'/teacher-tool/getCurrentTrimesterDetail.php')
      .then(function(data){
        self.currentTrimester = data.data.currTri;
        self.currTriClassList = data.data.info
      });
    },
    loginToAdmin: function(){
      let formData = new FormData();
      let self = this;
      formData.append('passw', this.adminPassword)

      axios.post(this.hostName+'/teacher-tool/adminLogin.php',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function(data){
          self.adminLoggedIn = data.data.success;
          if(!data.data.success){
            alert('Incorrect password');
          }
        }).catch(function(e){console.warn('FAILURE!!',e);});
    },
    dlExcel: function(classId) {
      let classAdd = (classId) ? '?classId='+classId : '';
      let dlWindow = window.open(this.hostName+'/teacher-tool/downloadClassInfo.php'+classAdd, "Download Class Info", "resizable,scrollbars,status");
    },
    getAdvisorInfo: function (advisorId) {
      
      var advisorInd = this.advisorList.findIndex(x => x.id === advisorId);
      if(advisorInd !== false){
        return this.advisorList[advisorInd].firstName+' '+this.advisorList[advisorInd].lastName
      }else{
        return 'Not Found'
      }
    },
    buildAdvisorOptList: function(){
      let self = this

      this.advisorOptList = []
      this.advisorList.forEach(function (item) {
        self.advisorOptList.push({'value':item.id, 'text':item.firstName+' '+item.lastName})
      })
    },
    rData: function(){
      this.getAllOfType('class');
      this.getAllOfType('advisor');
      this.getCurrentTrimester();
    }
  },
  created(){
    let self = this;
    this.dataGrabTimer = window.setInterval(function(){
      self.rData();
    }, 4000);
  },
  beforeMount(){
    this.getAllOfType('class');
    this.getAllOfType('advisor');
    this.getCurrentTrimester();
  },
  name: 'Admin',
  data: function () {
    return {
      dataGrabTimer: false,
      adminLoggedIn: true,
      adminPassword: '',
      currentTrimester: null,
      currTriClassList: null,
      viewClassStudents: false,
      hostName: (process.env.NODE_ENV === 'development') ? 'http://localhost:8888' : 'http://the1johnson.com',
      trimesterList: [
        { value: null, text: 'Please select an option' },
        { value: 't1', text: 'T1' },
        { value: 't2', text: 'T2' },
        { value: 't3', text: 'T3' },
      ],
      academyList: [
        { value: 'prep', text: 'Prep Academy' },
        { value: 'senior', text: 'Senior Academy' },
      ],
      classList: null,
      advisorList: null,
      advisorOptList: null,
      newAdvisor:{
        firstName: '',
        lastName: ''
      },
      newClass:{
        name:null,
        description:null,
        trimester:null,
        academy:'prep',
        studentCount: 35,
        year:new Date().getFullYear()
      },
      editAdvisorObj:{
        firstName: '',
        lastName: ''
      },
      editClassObj:{
        name:null,
        description:null,
        trimester:null,
        academy:'prep',
        studentCount: 35,
        year:new Date().getFullYear()
      },
      editElectiveObj:{
        classId: null,
        advisorId: null,
        studentId: null,
        firstName: '',
        lastName: ''
      }
    }
  }
}
</script>