import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-processing-stage-section',
  imports: [NgClass,TranslateModule],
  templateUrl: './processing-stage-section.component.html',
  styleUrl: './processing-stage-section.component.scss'
})
export class ProcessingStageSectionComponent implements OnInit {
private currentIndex = 0;
  private autoChangeInterval: any;
  private userClicked = false;
 private restartTimeout: any; 
  

  stages:any[] = [];
  stagesEN:any = [
  {
    "id": 1,
    "title": "Reception",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/01.jpg",
    "content": "Only approved suppliers by the Quality Control (QC) Department are allowed to provide raw materials. Primary inspection takes place immediately upon arrival, as defined in our QC standard procedure, to decide on material acceptance or rejection. Accepted materials are labeled with a Lot Number and detailed records (farm name/code, entry date, specifications) are logged. Proof of origin (farm bill) must accompany the material and is kept on file."
  },
  {
    "id": 2,
    "title": "Sun or machine drying",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/02.jpg",
    "content": "Fresh herbs undergo sun drying under shade. Machine drying facilities are cleaned daily and maintained to prevent contamination. Crucially, no simultaneous operations on two different items are allowed to completely eliminate cross-contamination risk."
  },
  {
    "id": 3,
    "title": "Processing unit",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/03.jpg",
    "content": "The processing unit must be cleaned according to our strict cleaning and sanitation procedures before starting any processing activities, ensuring a hygienic start for every batch."
  },
  {
    "id": 4,
    "title": "Sorting and grading",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/04.jpg",
    "content": "Sorting and grading are meticulously performed, primarily manually, supplemented by sieving where necessary. This ensures uniformity of the batch before final processing."
  },
  {
    "id": 5,
    "title": "Checked Machine Operation",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/05.jpg",
    "content": "Crushing (for seeds or TBC) or cutting (e.g., lemongrass) is only executed after verifying the machine's cleanliness and suitability for the specific material, preventing residual contamination."
  },
  {
    "id": 6,
    "title": "Metal Detection and Lab Analysis",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/06.jpg",
    "content": " All products are subjected to a metal-detection test to ensure they do not include any ferrous or non-ferrous metals. Additionally, a sample is sent to a relevant external lab to verify that no contamination occurred during the internal processing phase."
  },
  {
    "id": 7,
    "title": "Manual Packing, Weighing, and Labeling",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/07.jpg",
    "content": "Packing, weighing, and labeling processes are performed manually. This ensures precision in final weight and adherence to the specific packaging standards for each product type."
  },
  {
    "id": 8,
    "title": "Reference Sample Collection and Retention",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/08.jpg",
    "content": "Reference samples are collected by the QC Department to perform final quality tests and analysis as described in the standard procedure. A crucial part of these samples is kept at the company as a reference sample for the product's recommended shelf life (up to 2 years)."
  },
  {
    "id": 9,
    "title": "Final Storage Pending QC Clearance",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/09.jpg",
    "content": "Final products are stored in the company's designated final-product stores. They remain here until the Quality Control Department issues final clearance for shipping, confirming the batch meets all specified standards."
  },
  {
    "id": 10,
    "title": "Comprehensive Record Keeping (Traceability)",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/10.jpg",
    "content": "All preceding operations, including the farm bill, processing records, and analysis results, are systematically filed and saved. This facilitates a swift and complete end-to-end traceability process for any shipped item."
  }
  ]
  stagesAR:any = [
  {
    "id": 1,
    "title": "الاستلام",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/01.jpg",
    "content": "يُسمح فقط للموردين المعتمدين من قبل قسم مراقبة الجودة (QC) بتوريد المواد الخام. يتم إجراء الفحص الأولي فور وصول المواد، وفقًا لإجراءات مراقبة الجودة القياسية لدينا، لتحديد ما إذا كانت المواد مقبولة أو مرفوضة. تُوسم المواد المقبولة برقم تشغيلي (Lot Number)، ويتم تسجيل التفاصيل بدقة مثل اسم أو كود المزرعة، وتاريخ الدخول، والمواصفات. يجب أن تكون فاتورة المزرعة (إثبات المنشأ) مرافقة للمواد وتحفظ في السجلات."
  },
  {
    "id": 2,
    "title": "التجفيف الشمسي أو الآلي",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/02.jpg",
    "content": "تُجفف الأعشاب الطازجة تحت الظل باستخدام أشعة الشمس. أما مرافق التجفيف الآلي فيتم تنظيفها يوميًا وصيانتها لتجنب أي تلوث. ومن المهم أنه لا يُسمح بتنفيذ عمليات على نوعين مختلفين من المواد في نفس الوقت لتجنب خطر التلوث المتبادل تمامًا."
  },
  {
    "id": 3,
    "title": "وحدة المعالجة",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/03.jpg",
    "content": "يجب تنظيف وحدة المعالجة وفقًا لإجراءات التنظيف والتعقيم الصارمة الخاصة بنا قبل بدء أي نشاط من أنشطة المعالجة، لضمان بداية نظيفة وصحية لكل دفعة إنتاج."
  },
  {
    "id": 4,
    "title": "الفرز والتصنيف",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/04.jpg",
    "content": "يتم تنفيذ عملية الفرز والتصنيف بدقة عالية، في الغالب يدويًا، مع استخدام الغربلة عند الحاجة. يضمن ذلك توحيد الدفعة قبل المعالجة النهائية."
  },
  {
    "id": 5,
    "title": "تشغيل الآلات بعد التحقق",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/05.jpg",
    "content": "يُسمح بعمليات الطحن (للبذور أو TBC) أو التقطيع (مثل الليمون العطري) فقط بعد التأكد من نظافة الآلة وصلاحيتها للمادة المحددة، وذلك لتجنب أي تلوث متبقي من عمليات سابقة."
  },
  {
    "id": 6,
    "title": "الكشف عن المعادن والتحليل المخبري",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/06.jpg",
    "content": "تخضع جميع المنتجات لاختبار الكشف عن المعادن للتأكد من خلوها من أي معادن حديدية أو غير حديدية. بالإضافة إلى ذلك، يتم إرسال عينة إلى مختبر خارجي متخصص للتحقق من عدم حدوث أي تلوث أثناء مراحل المعالجة الداخلية."
  },
  {
    "id": 7,
    "title": "التعبئة والوزن ووضع الملصقات يدويًا",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/07.jpg",
    "content": "تُنفذ عمليات التعبئة والوزن ووضع الملصقات يدويًا لضمان الدقة في الوزن النهائي والالتزام بمعايير التعبئة الخاصة بكل نوع من المنتجات."
  },
  {
    "id": 8,
    "title": "جمع العينات المرجعية والاحتفاظ بها",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/08.jpg",
    "content": "يقوم قسم مراقبة الجودة بجمع عينات مرجعية لإجراء الاختبارات والتحاليل النهائية وفقًا للإجراءات القياسية. ويتم الاحتفاظ بجزء من هذه العينات في الشركة كعينة مرجعية طوال فترة الصلاحية الموصى بها للمنتج (حتى عامين)."
  },
  {
    "id": 9,
    "title": "التخزين النهائي في انتظار موافقة مراقبة الجودة",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/09.jpg",
    "content": "تُخزَّن المنتجات النهائية في المخازن المخصصة لذلك داخل الشركة، وتبقى هناك حتى يمنح قسم مراقبة الجودة الموافقة النهائية على الشحن، مؤكدًا أن الدفعة تستوفي جميع المعايير المحددة."
  },
  {
    "id": 10,
    "title": "حفظ السجلات الشامل (التتبع الكامل)",
    "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/10.jpg",
    "content": "تُحفظ جميع العمليات السابقة — بما في ذلك فاتورة المزرعة وسجلات المعالجة ونتائج التحاليل — بطريقة منظمة ومنسقة، مما يتيح عملية تتبع سريعة وكاملة لأي منتج يتم شحنه."
  }
  ]

  ngOnInit(): void {
    if (localStorage.getItem("lang") =='ar') {
      this.stages = this.stagesAR;
    }
    else{
      this.stages = this.stagesEN;
    }
    this.selectedStage = this.stages[0];
     this.startAutoChange();
  }
  toggleExpand(stage: any) {
    stage.expanded = !stage.expanded;
  }

  selectedStage: any 

   startAutoChange() {
      clearInterval(this.autoChangeInterval);
    const changeInterval = 4000; 
    this.autoChangeInterval = setInterval(() => {
      if (this.userClicked) return;
      this.nextStage();
    }, changeInterval);
  }

  nextStage() {
    this.currentIndex = (this.currentIndex + 1) % this.stages.length;
    this.selectedStage = this.stages[this.currentIndex];
  }

selectStage(stage: any): void {
    this.selectedStage = stage;
    this.currentIndex = this.stages.findIndex((s) => s.id === stage.id);

    clearInterval(this.autoChangeInterval);

    clearTimeout(this.restartTimeout);

    this.restartTimeout = setTimeout(() => {
      this.startAutoChange();
    }, 10000); 
  }

  ngOnDestroy(): void {
    clearInterval(this.autoChangeInterval);
    clearTimeout(this.restartTimeout);
  }

}



// import { NgClass } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { TranslateModule } from '@ngx-translate/core';

// @Component({
//   selector: 'app-processing-stage-section',
//   imports: [NgClass,TranslateModule],
//   templateUrl: './processing-stage-section.component.html',
//   styleUrl: './processing-stage-section.component.scss'
// })
// export class ProcessingStageSectionComponent implements OnInit {
// private currentIndex = 0;
//   private autoChangeInterval: any;
//   private userClicked = false;

  

//   stages:any[] = [];
//   stagesEN:any = [
//   {
//     "id": 1,
//     "title": "Reception",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/01.jpg",
//     "content": "Only approved suppliers by the Quality Control (QC) Department are allowed to provide raw materials. Primary inspection takes place immediately upon arrival, as defined in our QC standard procedure, to decide on material acceptance or rejection. Accepted materials are labeled with a Lot Number and detailed records (farm name/code, entry date, specifications) are logged. Proof of origin (farm bill) must accompany the material and is kept on file."
//   },
//   {
//     "id": 2,
//     "title": "Sun or machine drying",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/02.jpg",
//     "content": "Fresh herbs undergo sun drying under shade. Machine drying facilities are cleaned daily and maintained to prevent contamination. Crucially, no simultaneous operations on two different items are allowed to completely eliminate cross-contamination risk."
//   },
//   {
//     "id": 3,
//     "title": "Processing unit",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/03.jpg",
//     "content": "The processing unit must be cleaned according to our strict cleaning and sanitation procedures before starting any processing activities, ensuring a hygienic start for every batch."
//   },
//   {
//     "id": 4,
//     "title": "Sorting and grading",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/04.jpg",
//     "content": "Sorting and grading are meticulously performed, primarily manually, supplemented by sieving where necessary. This ensures uniformity of the batch before final processing."
//   },
//   {
//     "id": 5,
//     "title": "Checked Machine Operation",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/05.jpg",
//     "content": "Crushing (for seeds or TBC) or cutting (e.g., lemongrass) is only executed after verifying the machine's cleanliness and suitability for the specific material, preventing residual contamination."
//   },
//   {
//     "id": 6,
//     "title": "Metal Detection and Lab Analysis",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/06.jpg",
//     "content": " All products are subjected to a metal-detection test to ensure they do not include any ferrous or non-ferrous metals. Additionally, a sample is sent to a relevant external lab to verify that no contamination occurred during the internal processing phase."
//   },
//   {
//     "id": 7,
//     "title": "Manual Packing, Weighing, and Labeling",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/07.jpg",
//     "content": "Packing, weighing, and labeling processes are performed manually. This ensures precision in final weight and adherence to the specific packaging standards for each product type."
//   },
//   {
//     "id": 8,
//     "title": "Reference Sample Collection and Retention",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/08.jpg",
//     "content": "Reference samples are collected by the QC Department to perform final quality tests and analysis as described in the standard procedure. A crucial part of these samples is kept at the company as a reference sample for the product's recommended shelf life (up to 2 years)."
//   },
//   {
//     "id": 9,
//     "title": "Final Storage Pending QC Clearance",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/09.jpg",
//     "content": "Final products are stored in the company's designated final-product stores. They remain here until the Quality Control Department issues final clearance for shipping, confirming the batch meets all specified standards."
//   },
//   {
//     "id": 10,
//     "title": "Comprehensive Record Keeping (Traceability)",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/10.jpg",
//     "content": "All preceding operations, including the farm bill, processing records, and analysis results, are systematically filed and saved. This facilitates a swift and complete end-to-end traceability process for any shipped item."
//   }
//   ]
//   stagesAR:any = [
//   {
//     "id": 1,
//     "title": "الاستلام",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/01.jpg",
//     "content": "يُسمح فقط للموردين المعتمدين من قبل قسم مراقبة الجودة (QC) بتوريد المواد الخام. يتم إجراء الفحص الأولي فور وصول المواد، وفقًا لإجراءات مراقبة الجودة القياسية لدينا، لتحديد ما إذا كانت المواد مقبولة أو مرفوضة. تُوسم المواد المقبولة برقم تشغيلي (Lot Number)، ويتم تسجيل التفاصيل بدقة مثل اسم أو كود المزرعة، وتاريخ الدخول، والمواصفات. يجب أن تكون فاتورة المزرعة (إثبات المنشأ) مرافقة للمواد وتحفظ في السجلات."
//   },
//   {
//     "id": 2,
//     "title": "التجفيف الشمسي أو الآلي",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/02.jpg",
//     "content": "تُجفف الأعشاب الطازجة تحت الظل باستخدام أشعة الشمس. أما مرافق التجفيف الآلي فيتم تنظيفها يوميًا وصيانتها لتجنب أي تلوث. ومن المهم أنه لا يُسمح بتنفيذ عمليات على نوعين مختلفين من المواد في نفس الوقت لتجنب خطر التلوث المتبادل تمامًا."
//   },
//   {
//     "id": 3,
//     "title": "وحدة المعالجة",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/03.jpg",
//     "content": "يجب تنظيف وحدة المعالجة وفقًا لإجراءات التنظيف والتعقيم الصارمة الخاصة بنا قبل بدء أي نشاط من أنشطة المعالجة، لضمان بداية نظيفة وصحية لكل دفعة إنتاج."
//   },
//   {
//     "id": 4,
//     "title": "الفرز والتصنيف",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/04.jpg",
//     "content": "يتم تنفيذ عملية الفرز والتصنيف بدقة عالية، في الغالب يدويًا، مع استخدام الغربلة عند الحاجة. يضمن ذلك توحيد الدفعة قبل المعالجة النهائية."
//   },
//   {
//     "id": 5,
//     "title": "تشغيل الآلات بعد التحقق",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/05.jpg",
//     "content": "يُسمح بعمليات الطحن (للبذور أو TBC) أو التقطيع (مثل الليمون العطري) فقط بعد التأكد من نظافة الآلة وصلاحيتها للمادة المحددة، وذلك لتجنب أي تلوث متبقي من عمليات سابقة."
//   },
//   {
//     "id": 6,
//     "title": "الكشف عن المعادن والتحليل المخبري",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/06.jpg",
//     "content": "تخضع جميع المنتجات لاختبار الكشف عن المعادن للتأكد من خلوها من أي معادن حديدية أو غير حديدية. بالإضافة إلى ذلك، يتم إرسال عينة إلى مختبر خارجي متخصص للتحقق من عدم حدوث أي تلوث أثناء مراحل المعالجة الداخلية."
//   },
//   {
//     "id": 7,
//     "title": "التعبئة والوزن ووضع الملصقات يدويًا",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/07.jpg",
//     "content": "تُنفذ عمليات التعبئة والوزن ووضع الملصقات يدويًا لضمان الدقة في الوزن النهائي والالتزام بمعايير التعبئة الخاصة بكل نوع من المنتجات."
//   },
//   {
//     "id": 8,
//     "title": "جمع العينات المرجعية والاحتفاظ بها",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/08.jpg",
//     "content": "يقوم قسم مراقبة الجودة بجمع عينات مرجعية لإجراء الاختبارات والتحاليل النهائية وفقًا للإجراءات القياسية. ويتم الاحتفاظ بجزء من هذه العينات في الشركة كعينة مرجعية طوال فترة الصلاحية الموصى بها للمنتج (حتى عامين)."
//   },
//   {
//     "id": 9,
//     "title": "التخزين النهائي في انتظار موافقة مراقبة الجودة",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/09.jpg",
//     "content": "تُخزَّن المنتجات النهائية في المخازن المخصصة لذلك داخل الشركة، وتبقى هناك حتى يمنح قسم مراقبة الجودة الموافقة النهائية على الشحن، مؤكدًا أن الدفعة تستوفي جميع المعايير المحددة."
//   },
//   {
//     "id": 10,
//     "title": "حفظ السجلات الشامل (التتبع الكامل)",
//     "pictureUrl": "https://radwaminta.runasp.net/Images/Quality/10.jpg",
//     "content": "تُحفظ جميع العمليات السابقة — بما في ذلك فاتورة المزرعة وسجلات المعالجة ونتائج التحاليل — بطريقة منظمة ومنسقة، مما يتيح عملية تتبع سريعة وكاملة لأي منتج يتم شحنه."
//   }
//   ]

//   ngOnInit(): void {
//     if (localStorage.getItem("lang") =='ar') {
//       this.stages = this.stagesAR;
//     }
//     else{
//       this.stages = this.stagesEN;
//     }
//     this.selectedStage = this.stages[0];
//      this.startAutoChange();
//   }
//   toggleExpand(stage: any) {
//     stage.expanded = !stage.expanded;
//   }

//   selectedStage: any 

//    startAutoChange() {
//     const changeInterval = 4000; 
//     this.autoChangeInterval = setInterval(() => {
//       if (this.userClicked) return;
//       this.nextStage();
//     }, changeInterval);
//   }

//   nextStage() {
//     this.currentIndex = (this.currentIndex + 1) % this.stages.length;
//     this.selectedStage = this.stages[this.currentIndex];
//   }

//   selectStage(stage: any, manual = false) {
//     this.selectedStage = stage;
//     this.currentIndex = this.stages.findIndex((s) => s.id === stage.id);

//     if (manual) {
//       this.userClicked = true;
//       clearInterval(this.autoChangeInterval);
//       setTimeout(() => {
//         this.userClicked = false;
//         this.startAutoChange();
//       }, 10000);
//     }
//   }
//   ngOnDestroy(): void {
//     clearInterval(this.autoChangeInterval);
//   }

// }
