import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as h from "../logic/helper";
import * as q from "../logic/AlgoQueue";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

  timer: number;
  interval: number = 500;   // set interval timer 
  newInterval: number = 500;
  setupCycle: number = 1000;   // well use this setupCycle updated from the Setup page 
                              // to increase / decrease the time interval

  tagsCounter: number;
  i: number = 0;
  nrInterests = 7;  // 7 Default interests :-)

  // TODO - Build Account Setup page to setup like these

  superFriendsNo = 532134;
  superProjectsNo = 2344;
  superServicesNo = 3701;
  superTxPerMs = 1628;
  superRatePerMin = 9.07;

  officeFriendsNo = 5369;
  officeProjectsNo = 364;
  officeServicesNo = 734;
  officeTxPerMs = 156;
  officeRatePerMin = 0.89;

  realtime = false;

  // vars for spinner
  // 7 Tags / Links
  link1: string = '';
  link2: string = '';
  link3: string = '';
  link4: string = '';
  link5: string = '';
  link6: string = '';
  link7: string = '';
  // Nr Projects for Tag / Link
  pT1: number = 0;
  pT2: number = 0;
  pT3: number = 0;
  pT4: number = 0;
  pT5: number = 0;
  pT6: number = 0;
  pT7: number = 0;
  // Nr Services for Tag / Link
  sT1: number = 0;
  sT2: number = 0;
  sT3: number = 0;
  sT4: number = 0;
  sT5: number = 0;
  sT6: number = 0;
  sT7: number = 0;

  nProject1: string = '';
  nProject2: string = '';
  nProject3: string = '';
  nProject4: string = '';
  nProject5: string = '';
  nProject6: string = '';
  nProject7: string = '';
  // Country Flag / Code for Project
  pF1: string = '';
  pF2: string = '';
  pF3: string = '';
  pF4: string = '';
  pF5: string = '';
  pF6: string = '';
  pF7: string = '';

  nService1: string = '';
  nService2: string = '';
  nService3: string = '';
  nService4: string = '';
  nService5: string = '';
  nService6: string = '';
  nService7: string = '';
  // Country Flag / Code for Service
  sF1: string = '';
  sF2: string = '';
  sF3: string = '';
  sF4: string = '';
  sF5: string = '';
  sF6: string = '';
  sF7: string = '';

  // Arrays to store loop data from DNA Queue - declarations below are copied from the WorldMarket.gs file
  nrLinks: number;
  tag: any[] = [];
  problems: any[] = [];
  pFlags: any[] = [];         // Array with Country codes for Problems - country of owner
  services: any[] = [];
  sFlags: any[] = [];         // Array with Country codes for Services - country of owner
  // 15 - TODO - [ ] - add top header line to the matrix? including the nrProblems and Services
  nrProblems = 134;           // some default values for dev
  nrServices = 43;            // some default values for dev
  // 24 
  spikes = 7;     // Nr rows in the market wheel in the W3AI sheet - here called spikes
  // 28
  row0 = 0;       // to keep some similarity / compatibility with the gs code

  startDnaLoop() {
    this.timer = setInterval( ()=> {
      this.dnaLoop();
    }, this.interval );
  }

  dnaLoop() {
    this.updateLoopTable();
    this.i++;   // increment the index of the DNA Queue
    this.w3aiStats();
  }

  onSetCycle(newCycle: number) {
    clearInterval(this.timer);
    // Line below is just to offer a bit of feedback onSetCycle change
    this.interval = newCycle;
    this.startDnaLoop();
  }

  constructor() {
    this.readQueueIntoLoopArrays();
    this.timer = setInterval( ()=> {
      this.updateLoopTable();
      // Move to next tag / link in the queue
      this.i++;
      this.w3aiStats();
    }, this.interval );
  }

  readQueueIntoLoopArrays() {
    // Translating gs code from function intlTeams() from WorldMarket.gs / W3AI spreadsheet / @W3AI.net 
    // 14 - Starting from line 14 - skipping the gs files initializations
    this.nrLinks = q.queue.length;
    this.nrInterests = this.nrLinks;
    // console.log('-- Queue Length: ' + nrLinks);

    // TODO - [ ] - to review and change vars declarations below that are copied from the WorldMarket.gs file
    // 34 -  Define and load the tags array[][] / [tag, nr problems/tag, nr services/tag]
    // let tag = new Array(nrLinks);
    // let problems = new Array(nrLinks);
    // let pFlags = new Array(nrLinks);   // Array with Country codes for Problems
    // var services = new Array(nrLinks);
    // var sFlags = new Array(nrLinks);   // Array with Country codes for Services

    // 41 - 3 is removed now - The 3 in Rows (3 + t) is the header offset - the tags/links start from line/row 3 - Jun 10, 2018       
    for (let t = 0; t < this.nrLinks; t++) {

      this.tag[t] = new Array(3); // to write 3 values 
      this.tag[t][0] = q.queue[t][0]; // Read into tag[] the link value from Column 1 / A
      this.tag[t][1] = q.queue[t][2]; // Read into tag[] the nr problems/tag value from Column 3 / C
      this.tag[t][2] = q.queue[t][17]; // Read into tag[] the nr services/tag value from Column 18 / R

      // Jun 13 SI: I just added 7 columns for countries of the originator of each problem and service 
      this.problems[t] = new Array(this.tag[t][1]);
      this.pFlags[t] = new Array(this.tag[t][1]);
      for (let p = 0; p < this.tag[t][1]; p++) {
        this.problems[t][p] = q.queue[t][10 + p]; // demand.getRange(t, 11 + p).getValue(); // Problems Titles start in col 11 / K
        this.pFlags[t][p] = q.queue[t][3 + p];   // demand.getRange(t, 4 + p).getValue(); // Problems' Flags start in col 4 / D
      }

      this.services[t] = new Array(this.tag[t][2]);
      this.sFlags[t] = new Array(this.tag[t][2]);
      for (let s = 0; s < this.tag[t][2]; s++) {
        this.services[t][s] = q.queue[t][25 + s]; // demand.getRange(t, 26 + s).getValue();  // Services start in col 26 / Z
        this.sFlags[t][s] = q.queue[t][18 + s]; // demand.getRange(t, 19 + p).getValue(); // Problems' Flags start in col 19 / S
      }
    } // End loading the arrays for Tags, Problems, Services and Flags for Problems and services

  }

  updateLoopTable() {
    // Write the loop's 7 tags
    this.link1 = this.tag[(this.i + 0) % this.nrLinks][0];
    this.link2 = this.tag[(this.i + 1) % this.nrLinks][0];
    this.link3 = this.tag[(this.i + 2) % this.nrLinks][0];
    this.link4 = this.tag[(this.i + 3) % this.nrLinks][0];
    this.link5 = this.tag[(this.i + 4) % this.nrLinks][0];
    this.link6 = this.tag[(this.i + 5) % this.nrLinks][0];
    this.link7 = this.tag[(this.i + 6) % this.nrLinks][0];
    // Write the nr of Projects with the tag
    this.pT1 = this.tag[(this.i + 0) % this.nrLinks][1];
    this.pT2 = this.tag[(this.i + 1) % this.nrLinks][1];
    this.pT3 = this.tag[(this.i + 2) % this.nrLinks][1];
    this.pT4 = this.tag[(this.i + 3) % this.nrLinks][1];
    this.pT5 = this.tag[(this.i + 4) % this.nrLinks][1];
    this.pT6 = this.tag[(this.i + 5) % this.nrLinks][1];
    this.pT7 = this.tag[(this.i + 6) % this.nrLinks][1];
    // Write the nr of Services with the tag
    this.sT1 = this.tag[(this.i + 0) % this.nrLinks][2];
    this.sT2 = this.tag[(this.i + 1) % this.nrLinks][2];
    this.sT3 = this.tag[(this.i + 2) % this.nrLinks][2];
    this.sT4 = this.tag[(this.i + 3) % this.nrLinks][2];
    this.sT5 = this.tag[(this.i + 4) % this.nrLinks][2];
    this.sT6 = this.tag[(this.i + 5) % this.nrLinks][2];
    this.sT7 = this.tag[(this.i + 6) % this.nrLinks][2];

    // Write the Titles of the Projects associated with the mid Tag / Link - nr 4
    this.nProject1 = this.problems[(this.i + 3) % this.nrLinks][0];
    this.nProject2 = this.problems[(this.i + 3) % this.nrLinks][1];
    this.nProject3 = this.problems[(this.i + 3) % this.nrLinks][2];
    this.nProject4 = this.problems[(this.i + 3) % this.nrLinks][3];
    this.nProject5 = this.problems[(this.i + 3) % this.nrLinks][4];
    this.nProject6 = this.problems[(this.i + 3) % this.nrLinks][5];
    this.nProject7 = this.problems[(this.i + 3) % this.nrLinks][6];
    // Show Country code for each Project associated to tag 3
    this.pF1 = this.pFlags[(this.i + 3) % this.nrLinks][0];
    this.pF2 = this.pFlags[(this.i + 3) % this.nrLinks][1];
    this.pF3 = this.pFlags[(this.i + 3) % this.nrLinks][2];
    this.pF4 = this.pFlags[(this.i + 3) % this.nrLinks][3];
    this.pF5 = this.pFlags[(this.i + 3) % this.nrLinks][4];
    this.pF6 = this.pFlags[(this.i + 3) % this.nrLinks][5];
    this.pF7 = this.pFlags[(this.i + 3) % this.nrLinks][6];

    // Write the Titles of the Services associated with the mid Tag / Link - nr 4
    this.nService1 = this.services[(this.i + 3) % this.nrLinks][0];
    this.nService2 = this.services[(this.i + 3) % this.nrLinks][1];
    this.nService3 = this.services[(this.i + 3) % this.nrLinks][2];
    this.nService4 = this.services[(this.i + 3) % this.nrLinks][3];
    this.nService5 = this.services[(this.i + 3) % this.nrLinks][4];
    this.nService6 = this.services[(this.i + 3) % this.nrLinks][5];
    this.nService7 = this.services[(this.i + 3) % this.nrLinks][6];
    // Show Country code for each Service associated to tag 3
    this.sF1 = this.sFlags[(this.i + 3) % this.nrLinks][0];
    this.sF2 = this.sFlags[(this.i + 3) % this.nrLinks][1];
    this.sF3 = this.sFlags[(this.i + 3) % this.nrLinks][2];
    this.sF4 = this.sFlags[(this.i + 3) % this.nrLinks][3];
    this.sF5 = this.sFlags[(this.i + 3) % this.nrLinks][4];
    this.sF6 = this.sFlags[(this.i + 3) % this.nrLinks][5];
    this.sF7 = this.sFlags[(this.i + 3) % this.nrLinks][6];

  }

  w3aiStats() {
    // Super Neural Net Teams
    this.superFriendsNo = this.superFriendsNo + Math.floor(Math.random() * Math.floor(4))
      - Math.floor(Math.random() * Math.floor(2));
    this.superProjectsNo = this.superProjectsNo + Math.floor(Math.random() * Math.floor(3))
      - Math.floor(Math.random() * Math.floor(2));
    this.superServicesNo = this.superServicesNo + Math.floor(Math.random() * Math.floor(5))
      - Math.floor(Math.random() * Math.floor(2));
    this.superTxPerMs = this.superTxPerMs + Math.floor(Math.random() * Math.floor(3))
      - Math.floor(Math.random() * Math.floor(2));
    this.superRatePerMin = this.superRatePerMin + (Math.floor(Math.random() * Math.floor(3))
      - Math.floor(Math.random() * Math.floor(2))) / 100;

    // Office Teams
    this.officeFriendsNo = this.officeFriendsNo + Math.floor(Math.random() * Math.floor(2))
      - Math.floor(Math.random() * Math.floor(2));
    this.officeProjectsNo = this.officeProjectsNo + Math.floor(Math.random() * Math.floor(2))
      - Math.floor(Math.random() * Math.floor(2));
    this.officeServicesNo = this.officeServicesNo + Math.floor(Math.random() * Math.floor(2))
      - Math.floor(Math.random() * Math.floor(2));
    this.officeTxPerMs = this.officeTxPerMs + Math.floor(Math.random() * Math.floor(2))
      - Math.floor(Math.random() * Math.floor(2));
    this.officeRatePerMin = this.officeRatePerMin + (Math.floor(Math.random() * Math.floor(2))
      - Math.floor(Math.random() * Math.floor(2))) / 100;

  }

  getPrjFlag1() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF1 && (this.pF1 != '')) {
      flagPath += this.pF1.toUpperCase() + '.png)';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag2() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF2  && (this.pF2 != '')) {
      flagPath += this.pF2.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag3() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF3 && (this.pF3 != '' )) {
      flagPath += this.pF3.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag4() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF4 && (this.pF4 != '' )) {
      flagPath += this.pF4.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag5() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF5 && (this.pF5 != '' ) ) {
      flagPath += this.pF5.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag6() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF6 && (this.pF6 != '' ) ) {
      flagPath += this.pF6.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getPrjFlag7() {
    let flagPath = 'url(/assets/flags/';
    if ( this.pF7 && (this.pF7 != '' ) ) {
      flagPath += this.pF7.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }

  // 7 functions for getSrvFlags
  getSrvFlag1() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF1 && (this.sF1 != '')) {
      flagPath += this.sF1.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag2() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF2  && (this.sF2 != '')) {
      flagPath += this.sF2.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag3() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF3 && (this.sF3 != '' )) {
      flagPath += this.sF3.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag4() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF4 && (this.sF4 != '' )) {
      flagPath += this.sF4.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag5() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF5 && (this.sF5 != '' ) ) {
      flagPath += this.sF5.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag6() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF6 && (this.sF6 != '' ) ) {
      flagPath += this.sF6.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }
  getSrvFlag7() {
    let flagPath = 'url(/assets/flags/';
    if ( this.sF7 && (this.sF7 != '' ) ) {
      flagPath += this.sF7.toUpperCase() + '.png';
    } else {
      flagPath = 'url(/assets/flags/bg.png)';
    }
    return flagPath;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  //   // testing writing in the loop table from the queue matric
  //   // h.setCell('loop', 3, 3, 'test loop');
  //   // h.setCell('loop', 4, 4, q.queue[3][0]);

  } // END of ngAfterViewInit

  // async delay(ms: number) {
  //   await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  // }

}
