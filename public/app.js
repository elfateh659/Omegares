'use strict';
/* Omega Res — client */

// ---------------- i18n ----------------
const T = {
  ar: {
    app: 'Omega Res', appSub: 'نظام متابعة المشروعات والمشتريات',
    login: 'تسجيل الدخول', username: 'اسم المستخدم', password: 'كلمة المرور', loginHint: 'ادخل بحساب الموظف الذي أنشأه مدير النظام.',
    logout: 'خروج', myPassword: 'كلمة المرور', viewAs: 'العرض كـ', admin: 'مدير النظام',
    d_tech: 'المكتب الفني', d_exec: 'المكتب التنفيذي', d_purch: 'المشتريات', d_store: 'المخازن', d_acc: 'الحسابات',
    d_eng: 'مهندسو المشروعات', d_chair: 'رئيس مجلس الإدارة', d_it: 'تكنولوجيا المعلومات',
    tab_inbox: 'الوارد', tab_track: 'حركة المشروعات', tab_new: 'مشروع جديد', tab_stock: 'أرصدة المخزن', tab_staff: 'الموظفين', tab_account: 'حسابي',
    inboxTitle: 'الطلبات المنتظرة عند {d}', inboxSub: 'كل طلب هنا ينتظر إجراء من إدارتك.',
    trackTitle: 'حركة المشروعات', trackSub: 'حالة كل مشروع والإدارة المنتظر عندها الرد حتى الإغلاق.',
    f_all: 'الكل', f_active: 'قيد التنفيذ', f_closed: 'مغلقة', f_rejected: 'مرفوضة', f_draft: 'مسودات', search: 'بحث بالاسم أو الرقم',
    noInbox: 'لا توجد طلبات منتظرة', noInboxSub: 'عندما تصل طلبات إلى إدارتك ستظهر هنا.',
    noProjects: 'لا توجد مشروعات بعد', noProjectsSub: 'يبدأ المشروع من المكتب الفني بإنشاء مشروع جديد.',
    pickProject: 'اختر مشروعًا من القائمة لعرض تفاصيله.',
    st_draft: 'مسودة', st_purch_new: 'بانتظار استلام المشتريات', st_purch_quote: 'جاري تجميع عروض الأسعار', st_exec_review: 'مراجعة المكتب التنفيذي',
    st_chair: 'بانتظار اعتماد رئيس مجلس الإدارة', st_acc_new: 'بانتظار استلام الحسابات', st_acc_work: 'الحسابات — جاري الصرف',
    st_purch_buy_new: 'بانتظار استلام المشتريات للشراء', st_purch_buying: 'جاري الشراء', st_store_inspect: 'فحص المخازن',
    st_store_ship: 'في المخزن — جاهز للإرسال', st_eng_receive: 'جاري الإرسال للمشروع', st_closed: 'مغلق — تم الاستلام', st_rejected: 'مرفوض',
    yourTurn: 'بانتظارك', inProgress: 'قيد التنفيذ', waitingAt: 'بانتظار: {d}', handledBy: 'المستلم: {n}', inProgressBy: 'جاري التنفيذ — {n}',
    closedMsg: 'تم إغلاق المشروع — استلم المهندس الأصناف', rejectedMsg: 'رفض رئيس مجلس الإدارة الطلب',
    ph_quotes: 'المشتريات — عروض الأسعار', ph_buy: 'المشتريات — الشراء',
    engineer: 'مهندس المشروع', createdBy: 'أنشأه', createdAt: 'تاريخ الإنشاء', itemsCount: 'عدد البنود', total: 'الإجمالي المعتمد', paid: 'المبلغ المصروف',
    items: 'البنود والطلبات الفنية', item: 'البند', qty: 'الكمية', unit: 'الوحدة', spec: 'المواصفات الفنية', quotes: 'عروض الأسعار',
    unitPrice: 'سعر الوحدة', lineTotal: 'القيمة', inspection: 'الفحص', matched: 'مطابق', noQuotes: 'لا توجد أسعار بعد',
    supplier: 'المورد', price: 'السعر', addQuote: 'إضافة سعر', attachQuote: 'صورة عرض السعر', view: 'عرض', remove: 'حذف', chosen: 'المعتمد',
    history: 'سجل الحركة', invoices: 'فواتير الشراء', uploadInvoice: 'رفع فاتورة', noInvoices: 'لم تُرفع فواتير بعد',
    chairNote: 'ملاحظة رئيس مجلس الإدارة', note: 'ملاحظة (اختياري)', amount: 'المبلغ المصروف (ج.م)',
    a_send: 'إرسال إلى المشتريات', a_purch_receive: 'تم استلام الطلب', a_to_review: 'تم — إرسال للمراجعة', a_to_chair: 'تم — إرسال لرئيس مجلس الإدارة',
    a_approve: 'موافق', a_reject: 'مرفوض', a_acc_receive: 'استلام الطلب — جاري التنفيذ', a_acc_done: 'تم التنفيذ — تم صرف المبلغ',
    a_buy_receive: 'استلام للشراء — جاري التنفيذ', a_buy_done: 'تم التنفيذ — إرسال للمخازن', a_store_done: 'تم التنفيذ — إدخال الأصناف للمخزن',
    a_ship: 'إرسال إلى المشروع', a_eng_receive: 'تأكيد الاستلام', a_reopen: 'إعادة فتح وتعديل الطلب',
    h_create: 'إنشاء المشروع', h_edit: 'تعديل المسودة', h_send: 'إرسال إلى المشتريات', h_purch_receive: 'استلام المشتريات للطلب',
    h_to_review: 'إرسال الأسعار للمكتب التنفيذي', h_to_chair: 'اعتماد الأسعار وإرسالها لرئيس مجلس الإدارة', h_approve: 'موافقة رئيس مجلس الإدارة',
    h_reject: 'رفض رئيس مجلس الإدارة', h_acc_receive: 'استلام الحسابات — جاري التنفيذ', h_acc_done: 'صرف المبلغ — تم التنفيذ',
    h_buy_receive: 'استلام المشتريات للشراء', h_buy_done: 'رفع الفواتير وإرسال للمخازن', h_store_done: 'فحص الأصناف وإدخالها للمخزن',
    h_ship: 'جاري الإرسال للمشروع', h_eng_receive: 'استلام المهندس — إغلاق', h_reopen: 'إعادة فتح الطلب',
    hint_purch_new: 'طلب جديد من المكتب الفني. اضغط "تم استلام الطلب" لبدء تجميع عروض الأسعار باسمك.',
    hint_purch_quote: 'أضف أكثر من سعر لكل بند مع صورة عرض السعر، ثم اضغط "تم" لإرسالها للمكتب التنفيذي.',
    hint_exec_review: 'افحص العروض واختر سعرًا واحدًا لكل بند، ثم اضغط "تم".',
    hint_chair: 'راجع الأسعار المعتمدة ثم وافق أو ارفض الطلب.',
    hint_acc_new: 'طلب معتمد من رئيس مجلس الإدارة. استلم الطلب لبدء الفحص والصرف.',
    hint_acc_work: 'افحص الطلب واكتب المبلغ المصروف ثم اضغط "تم التنفيذ".',
    hint_purch_buy_new: 'تم صرف المبلغ. استلم الطلب لبدء الشراء.',
    hint_purch_buying: 'ارفع فواتير الشراء ثم اضغط "تم التنفيذ" لإرسال الأصناف للمخازن.',
    hint_store_inspect: 'افحص كل صنف وعلّم عليه "مطابق"، ثم اضغط "تم التنفيذ" لإدخال الأصناف في أرصدة المخزن تحت اسم المشروع.',
    hint_store_ship: 'الأصناف في المخزن تحت اسم المشروع. اضغط "إرسال إلى المشروع" عند خروجها.',
    hint_eng_receive: 'الأصناف في الطريق إليك. اضغط "تأكيد الاستلام" بعد استلامها.',
    hint_eng_other: 'بانتظار استلام المهندس {n}.',
    hint_rejected: 'يمكنك تعديل الطلب وإعادة إرساله.',
    edit: 'تعديل', del: 'حذف', confirmDel: 'تأكيد الحذف', cancel: 'إلغاء', save: 'حفظ',
    newTitle: 'مشروع جديد', editTitle: 'تعديل المشروع', newSub: 'اكتب اسم المشروع والطلبات الفنية ثم أرسله إلى إدارة المشتريات.',
    projectName: 'اسم المشروع', notes: 'ملاحظات عامة', chooseEng: 'اختر المهندس', addItem: 'إضافة بند', saveDraft: 'حفظ كمسودة', sendNow: 'إرسال إلى المشتريات',
    noEngineers: 'لا يوجد مهندسون مسجلون. اطلب من مدير النظام إضافة موظفين في إدارة مهندسي المشروعات.',
    stockTitle: 'أرصدة المخزن', stockSub: 'الأصناف المدخلة للمخزن تحت اسم كل مشروع.',
    s_in: 'في المخزن', s_sending: 'جاري الإرسال', s_delivered: 'تم التسليم', stockValue: 'قيمة الأصناف بالمخزن', projectsInStock: 'مشروعات لها رصيد',
    noStock: 'لا توجد أصناف في المخزن', noStockSub: 'تظهر الأصناف هنا بعد فحصها وإدخالها من إدارة المخازن.',
    staffTitle: 'الموظفين', staffSub: 'إضافة موظفين في كل إدارة وإدارة حساباتهم.', addEmp: 'إضافة موظف', fullName: 'الاسم',
    dept: 'الإدارة', status: 'الحالة', active: 'نشط', inactive: 'موقوف', deactivate: 'إيقاف', activate: 'تفعيل', resetPw: 'كلمة مرور جديدة', setPw: 'تعيين',
    created: 'تم الحفظ', added: 'تمت إضافة الموظف', deactivated: 'الموظف مرتبط بمشروعات، تم إيقافه بدلًا من حذفه',
    accountTitle: 'حسابي', currentPw: 'كلمة المرور الحالية', newPw: 'كلمة المرور الجديدة', changePw: 'تغيير كلمة المرور', pwChanged: 'تم تغيير كلمة المرور',
    defaultPw: 'أنت تستخدم كلمة المرور الافتراضية. غيّرها من "حسابي".',
    done: 'تم', saved: 'تم الحفظ', uploading: 'جاري الرفع…', egp: 'ج.م', sure: 'متأكد؟',
    err_supplier: 'اكتب اسم المورد', err_price: 'اكتب سعرًا صحيحًا', err_fileType: 'صورة أو PDF فقط', err_net: 'تعذر الاتصال بالخادم',
    tab_wd: 'طلبات الصرف', sk_byProj: 'أصناف المشروعات', sk_general: 'المخزن العام', sk_generalSub: 'كل الأصناف بأرصدتها، والصنف الخاص بمشروع مكتوب بجواره اسم المشروع.',
    br_cairo: 'فرع القاهرة', br_alex: 'فرع الإسكندرية', br_all: 'كل الفروع', branch: 'الفرع', chooseBranch: 'اختر الفرع', branchView: 'الفرع',
    err_busy: 'الخادم لم يكمل الطلب، حاول مرة أخرى',
    mustChange: 'لحماية النظام: غيّر كلمة المرور الافتراضية الآن. بعد التغيير تظهر كل صفحات النظام.',
    restartWarn: 'السيرفر يعمل بنسخة قديمة. اقفل نافذة السيرفر وشغّل start.bat من جديد حتى تعمل آخر التعديلات.', sk_unitPh: 'مثال: قطعة', sk_unitBad: 'راجع الوحدة', sk_unitHint: 'الوحدة كلمة (قطعة، كرتونة…) والكمية في خانة الرصيد.', sk_edit: 'تعديل',
    sk_generalSubNo: 'قائمة الأصناف الموجودة بالمخزن. الأرصدة تظهر لإدارة المخازن فقط.', sk_code: 'الكود', sk_barcode: 'الباركود', sk_balance: 'الرصيد', sk_gen: 'عام', sk_search: 'ابحث بالاسم أو الكود أو امسح الباركود…', sk_showZero: 'إظهار الأصناف المنتهية',
    sk_addProd: 'إضافة صنف للمخزن العام', sk_add: 'إضافة كمية', sk_none: 'لا توجد أصناف مطابقة', sk_genEmpty: 'المخزن العام فارغ',
    sk_genEmptySub: 'أضف الأصناف العامة من النموذج، وتدخل أصناف المشروعات هنا تلقائيًا بعد فحصها.', sk_scan: 'قارئ الباركود يكتب في خانة البحث مباشرة. اضغط على الباركود لتكبيره.',
    sk_items: 'أصناف بها رصيد', sk_projItems: 'أصناف مشروعات', sk_zero: 'أصناف منتهية', sk_name: 'اسم الصنف', sk_open: 'الرصيد الافتتاحي', sk_low: 'رصيد منخفض',
    lb_print: 'طباعة ملصقات الباركود', lb_sel: 'محدد', lb_hint: 'بدون تحديد تُطبع ملصقات كل الأصناف الظاهرة.', lb_title: 'ملصقات باركود المخزن', lb_popup: 'اسمح للمتصفح بفتح النوافذ المنبثقة لطباعة الملصقات.',
    wd_title: 'طلبات الصرف من المخزن', wd_sub: 'أي موظف يطلب أصنافًا من المخزن ← موافقة المكتب التنفيذي ← تنفيذ المخازن ← إبلاغ صاحب الطلب والمكتب التنفيذي.',
    wd_new: 'طلب صرف جديد', wd_purpose: 'الغرض من الطلب', wd_pick: 'اختر صنفًا', wd_avail: 'المتاح', wd_send: 'إرسال الطلب', wd_addLine: 'إضافة صنف', wd_req: 'مقدم الطلب', wd_now: 'الرصيد الآن',
    wf_act: 'بانتظارك', wf_mine: 'طلباتي', wf_active: 'قيد التنفيذ', wf_all: 'الكل',
    ws_exec: 'بانتظار موافقة المكتب التنفيذي', ws_approved: 'معتمد — بانتظار استلام المخازن', ws_store_work: 'جاري التنفيذ بالمخازن', ws_done: 'تم التنفيذ', ws_rejected: 'مرفوض',
    wp_req: 'مقدم الطلب', wp_done: 'تم التنفيذ',
    wa_approve: 'موافقة', wa_reject: 'رفض', wa_receive: 'استلام الطلب — جاري التنفيذ', wa_done: 'تم التنفيذ — صرف الأصناف',
    wg_exec: 'راجع الطلب ووافق عليه أو ارفضه. بعد الموافقة يذهب للمخازن للتنفيذ.', wg_approved: 'وافق المكتب التنفيذي. استلم الطلب لبدء التنفيذ.',
    wg_store_work: 'جهّز الأصناف وسلّمها، ثم اضغط "تم التنفيذ" ليُخصم الرصيد ويُبلَّغ صاحب الطلب والمكتب التنفيذي.',
    wh_create: 'تقديم طلب الصرف', wh_approve: 'موافقة المكتب التنفيذي', wh_reject: 'رفض المكتب التنفيذي', wh_receive: 'استلام المخازن — جاري التنفيذ', wh_done: 'تم التنفيذ وصرف الأصناف',
    wd_info: 'للعلم: الطلب بانتظار موافقة المكتب التنفيذي قبل التنفيذ.', wd_doneMsg: 'تم صرف الأصناف وخصمها من رصيد المخزن.', wd_rejMsg: 'رفض المكتب التنفيذي الطلب.',
    wd_newBadge: 'تحديث جديد', wd_empty: 'لا توجد طلبات صرف', wd_emptySub: 'اضغط "طلب صرف جديد" لطلب أصناف من المخزن.', wd_pickOne: 'اختر طلبًا لعرض تفاصيله.', err_wd: 'اختر صنفًا وكمية لا تتجاوز المتاح.',
  },
  en: {
    app: 'Omega Res', appSub: 'Project & Procurement Workflow',
    login: 'Sign in', username: 'Username', password: 'Password', loginHint: 'Use the employee account created by the system admin.',
    logout: 'Sign out', myPassword: 'Password', viewAs: 'View as', admin: 'System admin',
    d_tech: 'Technical Office', d_exec: 'Executive Office', d_purch: 'Purchasing', d_store: 'Stores', d_acc: 'Accounts',
    d_eng: 'Project Engineers', d_chair: 'Chairman', d_it: 'IT',
    tab_inbox: 'Inbox', tab_track: 'Project tracking', tab_new: 'New project', tab_stock: 'Stock balances', tab_staff: 'Employees', tab_account: 'My account',
    inboxTitle: 'Waiting at {d}', inboxSub: 'Every request here needs action from your department.',
    trackTitle: 'Project tracking', trackSub: 'Each project\'s status and which department it is waiting on, until it closes.',
    f_all: 'All', f_active: 'In progress', f_closed: 'Closed', f_rejected: 'Rejected', f_draft: 'Drafts', search: 'Search by name or number',
    noInbox: 'Nothing waiting', noInboxSub: 'Requests that reach your department will show up here.',
    noProjects: 'No projects yet', noProjectsSub: 'Projects start at the Technical Office with a new project.',
    pickProject: 'Pick a project from the list to see its details.',
    st_draft: 'Draft', st_purch_new: 'Waiting for Purchasing to receive', st_purch_quote: 'Collecting price quotes', st_exec_review: 'Executive Office review',
    st_chair: 'Waiting for Chairman approval', st_acc_new: 'Waiting for Accounts to receive', st_acc_work: 'Accounts — disbursing',
    st_purch_buy_new: 'Waiting for Purchasing to buy', st_purch_buying: 'Purchasing in progress', st_store_inspect: 'Stores inspection',
    st_store_ship: 'In stock — ready to send', st_eng_receive: 'Sending to project', st_closed: 'Closed — received', st_rejected: 'Rejected',
    yourTurn: 'Your turn', inProgress: 'In progress', waitingAt: 'Waiting at: {d}', handledBy: 'Handled by: {n}', inProgressBy: 'In progress — {n}',
    closedMsg: 'Project closed — the engineer received the items', rejectedMsg: 'The Chairman rejected the request',
    ph_quotes: 'Purchasing — quotes', ph_buy: 'Purchasing — buying',
    engineer: 'Project engineer', createdBy: 'Created by', createdAt: 'Created', itemsCount: 'Items', total: 'Approved total', paid: 'Disbursed',
    items: 'Items & technical requests', item: 'Item', qty: 'Qty', unit: 'Unit', spec: 'Technical spec', quotes: 'Price quotes',
    unitPrice: 'Unit price', lineTotal: 'Value', inspection: 'Inspection', matched: 'OK', noQuotes: 'No quotes yet',
    supplier: 'Supplier', price: 'Price', addQuote: 'Add quote', attachQuote: 'Quote image', view: 'View', remove: 'Remove', chosen: 'Approved',
    history: 'Activity log', invoices: 'Purchase invoices', uploadInvoice: 'Upload invoice', noInvoices: 'No invoices uploaded yet',
    chairNote: 'Chairman note', note: 'Note (optional)', amount: 'Amount disbursed (EGP)',
    a_send: 'Send to Purchasing', a_purch_receive: 'Request received', a_to_review: 'Done — send for review', a_to_chair: 'Done — send to Chairman',
    a_approve: 'Approve', a_reject: 'Reject', a_acc_receive: 'Receive — start', a_acc_done: 'Done — amount disbursed',
    a_buy_receive: 'Receive for purchase — start', a_buy_done: 'Done — send to Stores', a_store_done: 'Done — add items to stock',
    a_ship: 'Send to project', a_eng_receive: 'Confirm receipt', a_reopen: 'Reopen and edit',
    h_create: 'Project created', h_edit: 'Draft edited', h_send: 'Sent to Purchasing', h_purch_receive: 'Purchasing received the request',
    h_to_review: 'Quotes sent to Executive Office', h_to_chair: 'Prices approved and sent to Chairman', h_approve: 'Chairman approved',
    h_reject: 'Chairman rejected', h_acc_receive: 'Accounts received — in progress', h_acc_done: 'Amount disbursed — done',
    h_buy_receive: 'Purchasing received for buying', h_buy_done: 'Invoices uploaded, sent to Stores', h_store_done: 'Items inspected and added to stock',
    h_ship: 'Sending to project', h_eng_receive: 'Engineer received — closed', h_reopen: 'Request reopened',
    hint_purch_new: 'New request from the Technical Office. Press "Request received" to start collecting quotes under your name.',
    hint_purch_quote: 'Add several prices per item with the quote image, then press "Done" to send them to the Executive Office.',
    hint_exec_review: 'Review the quotes and choose one price per item, then press "Done".',
    hint_chair: 'Review the approved prices, then approve or reject the request.',
    hint_acc_new: 'Approved by the Chairman. Receive the request to start review and disbursement.',
    hint_acc_work: 'Review the request, enter the amount disbursed, then press "Done".',
    hint_purch_buy_new: 'The amount has been disbursed. Receive the request to start buying.',
    hint_purch_buying: 'Upload the purchase invoices, then press "Done" to send the items to Stores.',
    hint_store_inspect: 'Inspect each item and mark it "OK", then press "Done" to add the items to stock under this project.',
    hint_store_ship: 'The items are in stock under this project. Press "Send to project" when they leave.',
    hint_eng_receive: 'The items are on their way to you. Press "Confirm receipt" once you have them.',
    hint_eng_other: 'Waiting for engineer {n} to confirm receipt.',
    hint_rejected: 'You can edit the request and send it again.',
    edit: 'Edit', del: 'Delete', confirmDel: 'Confirm delete', cancel: 'Cancel', save: 'Save',
    newTitle: 'New project', editTitle: 'Edit project', newSub: 'Enter the project name and technical requests, then send it to Purchasing.',
    projectName: 'Project name', notes: 'General notes', chooseEng: 'Choose engineer', addItem: 'Add item', saveDraft: 'Save draft', sendNow: 'Send to Purchasing',
    noEngineers: 'No engineers registered yet. Ask the system admin to add employees under Project Engineers.',
    stockTitle: 'Stock balances', stockSub: 'Items added to stock under each project.',
    s_in: 'In stock', s_sending: 'Sending', s_delivered: 'Delivered', stockValue: 'Value in stock', projectsInStock: 'Projects with stock',
    noStock: 'Nothing in stock', noStockSub: 'Items appear here after Stores inspects and adds them.',
    staffTitle: 'Employees', staffSub: 'Add employees to each department and manage their accounts.', addEmp: 'Add employee', fullName: 'Name',
    dept: 'Department', status: 'Status', active: 'Active', inactive: 'Suspended', deactivate: 'Suspend', activate: 'Activate', resetPw: 'New password', setPw: 'Set',
    created: 'Saved', added: 'Employee added', deactivated: 'Employee is linked to projects, so they were suspended instead of deleted',
    accountTitle: 'My account', currentPw: 'Current password', newPw: 'New password', changePw: 'Change password', pwChanged: 'Password changed',
    defaultPw: 'You are using the default password. Change it under "My account".',
    done: 'Done', saved: 'Saved', uploading: 'Uploading…', egp: 'EGP', sure: 'Sure?',
    err_supplier: 'Enter the supplier name', err_price: 'Enter a valid price', err_fileType: 'Images or PDF only', err_net: 'Could not reach the server',
    tab_wd: 'Withdrawals', sk_byProj: 'Project items', sk_general: 'General stock', sk_generalSub: 'Every item with its balance; project items show the project name.',
    br_cairo: 'Cairo branch', br_alex: 'Alexandria branch', br_all: 'All branches', branch: 'Branch', chooseBranch: 'Choose a branch', branchView: 'Branch',
    err_busy: 'The server did not finish the request, please try again',
    mustChange: 'To protect the system, change the default password now. All pages appear after you change it.',
    restartWarn: 'The server is running an old version. Close the server window and run start.bat again to apply the latest changes.', sk_unitPh: 'e.g. piece', sk_unitBad: 'Check unit', sk_unitHint: 'The unit is a word (piece, carton…); the quantity goes in the balance field.', sk_edit: 'Edit',
    sk_generalSubNo: 'Items available in stock. Balances are shown to Stores only.', sk_code: 'Code', sk_barcode: 'Barcode', sk_balance: 'Balance', sk_gen: 'General', sk_search: 'Search by name or code, or scan a barcode…', sk_showZero: 'Show depleted items',
    sk_addProd: 'Add item to general stock', sk_add: 'Add quantity', sk_none: 'No matching items', sk_genEmpty: 'General stock is empty',
    sk_genEmptySub: 'Add general items with the form; project items arrive here after inspection.', sk_scan: 'A barcode scanner types straight into the search box. Click a barcode to enlarge it.',
    sk_items: 'Items in stock', sk_projItems: 'Project items', sk_zero: 'Depleted', sk_name: 'Item name', sk_open: 'Opening balance', sk_low: 'Low balance',
    lb_print: 'Print barcode labels', lb_sel: 'selected', lb_hint: 'With nothing selected, labels print for every item shown.', lb_title: 'Stock barcode labels', lb_popup: 'Allow pop-ups in the browser to print labels.',
    wd_title: 'Stock withdrawal requests', wd_sub: 'Any employee requests items → Executive Office approves → Stores issues → requester and Executive Office are notified.',
    wd_new: 'New withdrawal request', wd_purpose: 'Purpose', wd_pick: 'Choose an item', wd_avail: 'Available', wd_send: 'Send request', wd_addLine: 'Add item', wd_req: 'Requested by', wd_now: 'Balance now',
    wf_act: 'Waiting for you', wf_mine: 'My requests', wf_active: 'In progress', wf_all: 'All',
    ws_exec: 'Awaiting Executive Office approval', ws_approved: 'Approved — awaiting Stores', ws_store_work: 'In progress at Stores', ws_done: 'Done', ws_rejected: 'Rejected',
    wp_req: 'Requester', wp_done: 'Done',
    wa_approve: 'Approve', wa_reject: 'Reject', wa_receive: 'Receive — start', wa_done: 'Done — issue items',
    wg_exec: 'Review the request and approve or reject it. Once approved it goes to Stores.', wg_approved: 'The Executive Office approved. Receive the request to start.',
    wg_store_work: 'Prepare and hand over the items, then press "Done" to deduct the balance and notify the requester and the Executive Office.',
    wh_create: 'Request submitted', wh_approve: 'Executive Office approved', wh_reject: 'Executive Office rejected', wh_receive: 'Stores received — in progress', wh_done: 'Done — items issued',
    wd_info: 'For your information: the request is waiting for Executive Office approval.', wd_doneMsg: 'The items were issued and deducted from stock.', wd_rejMsg: 'The Executive Office rejected the request.',
    wd_newBadge: 'New update', wd_empty: 'No withdrawal requests', wd_emptySub: 'Press "New withdrawal request" to ask for items from stock.', wd_pickOne: 'Pick a request to see its details.', err_wd: 'Choose an item and a quantity within the available balance.',
  }
};
// server messages (Arabic) → English
const SERVER_EN = {
  'اسم المستخدم أو كلمة المرور غير صحيحة': 'Wrong username or password',
  'يجب تسجيل الدخول': 'Please sign in', 'غير مصرح': 'Not allowed',
  'كلمة المرور الحالية غير صحيحة': 'Current password is wrong', 'كلمة المرور الجديدة 6 أحرف على الأقل': 'New password must be at least 6 characters',
  'كلمة المرور 6 أحرف على الأقل': 'Password must be at least 6 characters', 'الاسم واسم المستخدم مطلوبان': 'Name and username are required',
  'اختر الإدارة': 'Choose a department', 'اسم المستخدم مستخدم من قبل': 'Username already taken', 'لا يمكن حذف مدير النظام': 'The system admin cannot be deleted',
  'إنشاء المشروعات من المكتب الفني فقط': 'Only the Technical Office can create projects', 'اسم المشروع مطلوب': 'Project name is required',
  'اختر مهندس المشروع': 'Choose the project engineer', 'أضف بندًا واحدًا على الأقل': 'Add at least one item', 'اسم البند مطلوب': 'Item name is required',
  'الكمية يجب أن تكون أكبر من صفر': 'Quantity must be more than zero', 'الطلب ليس في هذه المرحلة الآن — حدّث الصفحة': 'The request has moved on — refresh the page',
  'غير مصرح لإدارتك بهذا الإجراء': 'Your department can\'t do this', 'الاستلام للمهندس المسؤول عن المشروع فقط': 'Only the project\'s engineer can confirm receipt',
  'أضف عرض سعر واحد على الأقل لكل بند': 'Add at least one quote per item', 'اختر سعرًا واحدًا لكل بند': 'Choose one price per item',
  'ارفع فاتورة شراء واحدة على الأقل': 'Upload at least one purchase invoice', 'افحص كل الأصناف قبل الإدخال للمخزن': 'Inspect every item before adding to stock',
  'أدخل المبلغ المصروف': 'Enter the amount disbursed', 'اسم المورد مطلوب': 'Supplier name is required', 'سعر الوحدة غير صحيح': 'Invalid unit price',
  'نوع الملف غير مدعوم (صورة أو PDF فقط)': 'Unsupported file (images or PDF only)', 'حجم الملف أكبر من 15 ميجابايت': 'File is larger than 15 MB',
  'حجم الطلب كبير جدًا': 'Request too large', 'المشروع غير موجود': 'Project not found',
  'اكتب اسم الصنف والوحدة والرصيد': 'Enter the item name, unit and balance', 'الصنف غير موجود': 'Item not found',
  'أصناف المشروعات تدخل المخزن من دورة المشروع فقط': 'Project items enter stock only through the project cycle',
  'أضف صنفًا واحدًا على الأقل': 'Add at least one item', 'غيّر كلمة المرور الافتراضية أولًا من صفحة حسابي': 'Change the default password first under My account', 'اختر كلمة مرور مختلفة عن الحالية': 'Choose a password different from the current one', 'محاولات دخول خاطئة كثيرة. حاول مرة أخرى بعد 15 دقيقة': 'Too many failed sign-in attempts. Try again in 15 minutes', 'اختر الفرع': 'Choose a branch', 'تستطيع إضافة موظفين لفرعك فقط': 'You can only add employees to your own branch', 'الوحدة تُكتب كلمة مثل قطعة أو كرتونة، والكمية تُكتب في خانة الرصيد': 'The unit must be a word such as piece or carton; the quantity goes in the balance field', 'الكمية المطلوبة غير متاحة بالمخزن: ': 'Requested quantity not available: ', 'الطلب غير موجود': 'Request not found', 'إجراء غير معروف': 'Unknown action',
};

// ---------------- state ----------------
const APP_VERSION = '2026-11-09.1';
const BRANCHES = ['cairo', 'alex']; // must match server.js
const DEPTS = ['tech', 'exec', 'purch', 'store', 'acc', 'eng', 'chair', 'it'];
const STAGES = {
  draft: ['tech', 0], purch_new: ['purch', 1], purch_quote: ['purch', 1], exec_review: ['exec', 2], chair: ['chair', 3],
  acc_new: ['acc', 4], acc_work: ['acc', 4], purch_buy_new: ['purch', 5], purch_buying: ['purch', 5],
  store_inspect: ['store', 6], store_ship: ['store', 6], eng_receive: ['eng', 7], closed: [null, 8], rejected: ['tech', 3],
};
const PHASES = ['tech', 'purch', 'exec', 'chair', 'acc', 'purch', 'store', 'eng'];
const STAGE_ACTIONS = {
  purch_new: ['purch_receive'], purch_quote: ['to_review'], exec_review: ['to_chair'], chair: ['approve', 'reject'],
  acc_new: ['acc_receive'], acc_work: ['acc_done'], purch_buy_new: ['buy_receive'], purch_buying: ['buy_done'],
  store_inspect: ['store_done'], store_ship: ['ship'], eng_receive: ['eng_receive'], rejected: ['reopen'],
};

let lang = 'ar';
try { lang = localStorage.getItem('omega-lang') || 'ar'; } catch {}
const S = {
  user: null, users: [], projects: [], tab: 'inbox', as: null, sel: null, filter: 'active', q: '',
  stock: [], withdrawals: [], skEdit: null, se: {}, skView: 'general', skQ: '', showZero: false, lblSel: [], aq: {}, pf: {}, wdNew: null, wdSel: null, wdFilter: 'act', wad: {},
  draft: null, editId: null, qd: {}, ad: {}, uf: { dept: 'tech' }, branch: '', pw: {}, login: {}, confirm: null, busy: false, loaded: false,
};
const newDraft = () => ({ name: '', engineerId: '', notes: '', items: [{ name: '', qty: '', unit: '', spec: '' }] });
S.draft = newDraft();

// ---------------- utils ----------------
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function t(k, vars) {
  let s = (T[lang] && T[lang][k]) ?? T.ar[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace('{' + a + '}', b);
  return s;
}
const dn = d => t('d_' + d);
const bn = b => t('br_' + b);
const allBr = () => !!S.user && (S.user.isAdmin || S.user.branch === 'all');
const brChip = x => allBr() && !S.branch && x.branch ? `<span class="br-chip">${bn(x.branch)}</span>` : '';
const defBranch = () => allBr() ? (S.branch || 'cairo') : S.user.branch;
const loc = () => (lang === 'ar' ? 'ar-EG' : 'en-GB');
const fmtN = n => Number(n || 0).toLocaleString(loc(), { maximumFractionDigits: 2 });
const money = n => fmtN(n) + ' ' + t('egp');
const fmtD = iso => iso ? new Intl.DateTimeFormat(loc(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '';
const fmtDay = iso => iso ? new Intl.DateTimeFormat(loc(), { dateStyle: 'medium' }).format(new Date(iso)) : '';
const errMsg = e => (lang === 'en' && SERVER_EN[e.message]) || e.message || t('err_net');

let toastTimer;
function toast(msg, bad) {
  const el = $('#toast'); el.textContent = msg; el.className = bad ? 'bad' : ''; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), bad ? 5000 : 2600);
}
async function api(method, url, body) {
  let r;
  try {
    r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  } catch { throw new Error(t('err_net')); }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && url !== '/api/login' && url !== '/api/me/password') { S.user = null; render(); }
  if (!r.ok) throw new Error(j.error || (r.status >= 500 ? t('err_busy') + ' (' + r.status + ')' : t('err_net')));
  return j;
}
function readFile(file) {
  return new Promise((res, rej) => {
    if (!/^image\/(png|jpeg|webp|gif)$|^application\/pdf$/.test(file.type)) return rej(new Error(t('err_fileType')));
    const fr = new FileReader();
    fr.onload = () => res({ name: file.name, type: file.type, data: String(fr.result).split(',')[1] });
    fr.onerror = () => rej(new Error(t('err_fileType')));
    fr.readAsDataURL(file);
  });
}
function setPath(obj, path, val) {
  const ks = path.split('.'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
  o[ks[ks.length - 1]] = val;
}
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

// ---------------- domain ----------------
const viewDept = () => S.as || S.user.dept;
const stageDept = p => STAGES[p.stage][0];
const phaseOf = p => STAGES[p.stage][1];
function canAct(p) {
  const d = stageDept(p);
  if (!d || !(S.user.isAdmin || S.user.dept === d)) return false;
  if (p.stage === 'eng_receive' && !S.user.isAdmin && p.engineerId !== S.user.id) return false;
  return true;
}
const ptotal = p => p.items.reduce((s, i) => { const q = i.quotes.find(q => q.id === i.selected); return s + (q ? q.price * i.qty : 0); }, 0);
function assignee(p) {
  return { purch_quote: p.assign?.purch, acc_work: p.assign?.acc, purch_buying: p.assign?.buy }[p.stage] || null;
}
function inbox() {
  const d = viewDept();
  return S.projects.filter(p => {
    if (p.stage === 'closed') return false;
    if (p.stage === 'draft' || p.stage === 'rejected') return d === 'tech';
    if (stageDept(p) !== d) return false;
    if (d === 'eng' && !S.user.isAdmin) return p.engineerId === S.user.id;
    return true;
  });
}
function status(p) {
  if (p.stage === 'draft') return ['draft', t('st_draft')];
  if (p.stage === 'closed') return ['ok', t('st_closed')];
  if (p.stage === 'rejected') return ['bad', t('st_rejected')];
  if (stageDept(p) === viewDept() && canAct(p)) return ['mine', t('yourTurn')];
  return ['wait', viewDept() === 'tech' ? t('inProgress') : t('st_' + p.stage)];
}
function waitLine(p) {
  if (p.stage === 'draft') return t('st_draft');
  if (p.stage === 'closed') return t('closedMsg');
  if (p.stage === 'rejected') return t('rejectedMsg');
  const a = assignee(p);
  let s = t('waitingAt', { d: dn(stageDept(p)) }) + ' · ' + t('st_' + p.stage);
  if (a) s += ' · ' + t('inProgressBy', { n: a.name });
  if (p.stage === 'eng_receive') s += ' · ' + p.engineerName;
  return s;
}
function phaseWho(p, i) {
  const h = a => [...p.history].reverse().find(x => x.action === a)?.by;
  return [p.createdBy, p.assign?.purch?.name, h('to_chair'), h('approve') || h('reject'), p.assign?.acc?.name, p.assign?.buy?.name, h('store_done'), p.engineerName][i] || '';
}

// ---------------- render ----------------
let pendingRender = false;
function render(soft) {
  if (soft) {
    const a = document.activeElement;
    if (a && a.matches('main input, main textarea, main select')) { pendingRender = true; return; }
  }
  pendingRender = false;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = 'Omega Res';
  const app = $('#app');
  if (!S.loaded) { app.innerHTML = ''; return; }
  if (!S.user) { app.innerHTML = loginView(); return; }
  const focusId = document.activeElement?.id;
  const pos = document.activeElement?.selectionStart;
  app.innerHTML = shell();
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); try { if (pos != null) el.setSelectionRange(pos, pos); } catch {} } }
}
document.addEventListener('focusout', () => setTimeout(() => { if (pendingRender && !document.activeElement?.matches('main input, main textarea, main select')) render(); }, 0));

function loginView() {
  return `<div class="login"><form class="panel login-card" data-form="login">
    <div class="brand"><div class="brand-mark">Ω</div><div><b>${t('app')}</b><small style="color:var(--muted)">${t('appSub')}</small></div></div>
    <h1>${t('login')}</h1><p>${t('loginHint')}</p>
    <label class="field"><span>${t('username')}</span><input type="text" id="lu" data-bind="login.username" autocomplete="username" value="${esc(S.login.username)}" required></label>
    <label class="field"><span>${t('password')}</span><input type="password" id="lp" data-bind="login.password" autocomplete="current-password" required></label>
    <div class="err">${esc(S.login.err || '')}</div>
    <button class="btn primary" type="submit">${t('login')}</button>
    <button class="btn ghost sm" type="button" data-act="lang">${lang === 'ar' ? 'English' : 'العربية'}</button>
  </form></div>`;
}

function tabsFor() {
  const u = S.user, d = viewDept(), tabs = [];
  if (u.mustChange) return ['account'];
  if (d !== 'it') tabs.push('inbox');
  tabs.push('track');
  if (u.isAdmin || u.dept === 'tech') tabs.push('new');
  tabs.push('wd');
  tabs.push('stock');
  if (u.isAdmin || u.dept === 'it') tabs.push('staff');
  tabs.push('account');
  return tabs;
}

function shell() {
  const u = S.user, tabs = tabsFor();
  if (!tabs.includes(S.tab)) S.tab = tabs[0];
  const n = inbox().length, wn = wdBadge();
  const asSel = u.isAdmin ? `<label style="display:flex;gap:6px;align-items:center;font-size:13px">${t('viewAs')}
      <select id="as" data-change="as">${DEPTS.map(d => `<option value="${d}" ${d === viewDept() ? 'selected' : ''}>${dn(d)}</option>`).join('')}</select></label>`
    : `<span class="dept-tag">${dn(u.dept)}</span>`;
  const brSel = allBr() ? `<label style="display:flex;gap:6px;align-items:center;font-size:13px">${t('branchView')}
      <select id="brsel" data-change="branch"><option value="">${t('br_all')}</option>${BRANCHES.map(b => `<option value="${b}" ${b === S.branch ? 'selected' : ''}>${bn(b)}</option>`).join('')}</select></label>`
    : `<span class="dept-tag">${bn(u.branch)}</span>`;
  return `<header class="bar"><div class="bar-in">
      <div class="brand"><div class="brand-mark">Ω</div><div><b>${t('app')}</b><small>${t('appSub')}</small></div></div>
      <div class="who"><span>${esc(u.name)}${u.isAdmin ? ' · ' + t('admin') : ''}</span>${brSel}${asSel}
        <button class="btn sm" data-act="lang">${lang === 'ar' ? 'EN' : 'ع'}</button>
        <button class="btn sm" data-act="logout">${t('logout')}</button></div>
    </div></header>
    <nav class="tabs"><div class="tabs-in">${tabs.map(k => `<button class="tab ${S.tab === k ? 'on' : ''}" data-act="tab" data-v="${k}">${k === 'new' && S.editId ? t('editTitle') : t('tab_' + k)}${k === 'inbox' && n ? `<span class="count">${fmtN(n)}</span>` : ''}${k === 'wd' && wn ? `<span class="count">${fmtN(wn)}</span>` : ''}</button>`).join('')}</div></nav>
    ${S.user.mustChange ? `<div class="restart-warn">${t('mustChange')}</div>` : ''}
    ${S.serverVersion !== APP_VERSION ? `<div class="restart-warn">${t('restartWarn')}</div>` : ''}
    <main>${({ inbox: inboxView, track: trackView, new: newView, stock: stockView, wd: wdView, staff: staffView, account: accountView })[S.tab]()}</main>`;
}

function inboxView() {
  const list = inbox();
  return `<div class="page-head"><div><h1>${t('inboxTitle', { d: dn(viewDept()) })}</h1><p>${t('inboxSub')}</p></div></div>
    ${split(list, list.length ? '' : `<div class="empty"><b>${t('noInbox')}</b>${t('noInboxSub')}</div>`)}`;
}
function trackView() {
  const f = S.filter, q = S.q.trim().toLowerCase();
  const list = S.projects.filter(p => {
    if (f === 'active' && ['closed', 'rejected', 'draft'].includes(p.stage)) return false;
    if (f === 'closed' && p.stage !== 'closed') return false;
    if (f === 'rejected' && p.stage !== 'rejected') return false;
    if (f === 'draft' && p.stage !== 'draft') return false;
    return !q || p.name.toLowerCase().includes(q) || p.number.toLowerCase().includes(q);
  });
  const filters = `<div class="filters">${['active', 'all', 'draft', 'closed', 'rejected'].map(k => `<button class="chip ${f === k ? 'on' : ''}" data-act="filter" data-v="${k}">${t('f_' + k)}</button>`).join('')}</div>
    <input type="text" id="search" data-bind="q" data-live="1" placeholder="${t('search')}" value="${esc(S.q)}">`;
  return `<div class="page-head"><div><h1>${t('trackTitle')}</h1><p>${t('trackSub')}</p></div></div>
    ${split(list, S.projects.length ? '' : `<div class="empty"><b>${t('noProjects')}</b>${t('noProjectsSub')}</div>`, filters)}`;
}
function split(list, emptyHtml, top = '') {
  if (S.sel && !list.some(p => p.id === S.sel) && !S.projects.some(p => p.id === S.sel)) S.sel = null;
  if (!S.sel && list.length && window.innerWidth > 900) S.sel = list[0].id;
  const sel = S.projects.find(p => p.id === S.sel);
  return `<div class="split"><div class="list">${top}${emptyHtml || list.map(card).join('')}</div>
    <div>${sel ? detail(sel) : (list.length ? `<div class="empty">${t('pickProject')}</div>` : '')}</div></div>`;
}
function mini(p) {
  const ph = phaseOf(p);
  const cls = p.stage === 'closed' ? 'closed' : p.stage === 'rejected' ? 'rejected' : '';
  return `<div class="mini ${cls}">${PHASES.map((_, i) => `<i class="${i < ph ? 'done' : i === ph && p.stage !== 'draft' ? 'cur' : ''}"></i>`).join('')}</div>`;
}
function card(p) {
  const [c, s] = status(p);
  const sub = ['closed', 'rejected', 'draft'].includes(p.stage) ? fmtDay(p.updatedAt) : t('waitingAt', { d: dn(stageDept(p)) });
  return `<button class="pcard ${S.sel === p.id ? 'on' : ''}" data-act="sel" data-id="${p.id}">
    <div class="row"><span class="eyebrow">${esc(p.number)}</span><span class="pill ${c}">${esc(s)}</span></div>
    <div class="pname">${esc(p.name)}</div>
    <div class="meta">${brChip(p)}${esc(sub)} · ${esc(p.engineerName)}</div>${mini(p)}</button>`;
}

function detail(p) {
  const [c, s] = status(p), act = canAct(p), tot = ptotal(p), ph = phaseOf(p);
  const isTechOwner = S.user.isAdmin || S.user.dept === 'tech';
  let headBtns = '';
  if (p.stage === 'draft' && isTechOwner) {
    headBtns = `<div class="row" style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn sm" data-act="edit" data-id="${p.id}">${t('edit')}</button>
      ${S.confirm === 'del-' + p.id ? `<button class="btn sm danger solid" data-act="delproj" data-id="${p.id}">${t('confirmDel')}</button><button class="btn sm" data-act="confirm" data-v="">${t('cancel')}</button>`
        : `<button class="btn sm danger" data-act="confirm" data-v="del-${p.id}">${t('del')}</button>`}
      <button class="btn sm primary" data-act="do" data-a="send" data-id="${p.id}">${t('a_send')}</button></div>`;
  }
  // tracker
  const track = `<div class="track ${p.stage === 'closed' ? 'closed' : ''}">${PHASES.map((d, i) => {
    let cls = i < ph ? 'done' : i === ph && !['draft', 'closed'].includes(p.stage) ? 'cur' : '';
    if (p.stage === 'rejected' && i === 3) cls = 'bad';
    if (p.stage === 'draft' && i === 0) cls = 'cur';
    const label = i === 1 ? t('ph_quotes') : i === 5 ? t('ph_buy') : dn(d);
    const who = phaseWho(p, i);
    return `<div class="step ${cls}"><span class="dot">${cls === 'done' || (p.stage === 'closed') ? '✓' : cls === 'bad' ? '✕' : fmtN(i + 1)}</span>
      <div>${esc(label)}${who && (cls || i <= ph) ? `<div class="who-s">${esc(who)}</div>` : ''}</div></div>`;
  }).join('')}</div>`;
  const wl = p.stage === 'closed' ? 'ok' : p.stage === 'rejected' ? 'bad' : act ? 'mine' : '';

  return `<article class="panel detail">
    <section><div class="dhead"><div style="min-width:0"><div class="eyebrow">${esc(p.number)} · ${fmtD(p.createdAt)}</div><h2>${esc(p.name)}</h2></div>
      <span class="pill ${c}">${esc(s)}</span></div>
      <div class="facts">
        <div><span>${t('branch')}</span>${bn(p.branch)}</div>
        <div><span>${t('engineer')}</span>${esc(p.engineerName)}</div>
        <div><span>${t('createdBy')}</span>${esc(p.createdBy)}</div>
        <div><span>${t('itemsCount')}</span><span class="num" style="display:inline;color:inherit;font-size:inherit">${fmtN(p.items.length)}</span></div>
        ${tot ? `<div><span>${t('total')}</span><b class="num">${money(tot)}</b></div>` : ''}
        ${p.payment ? `<div><span>${t('paid')}</span><b class="num">${money(p.payment.amount)}</b></div>` : ''}
      </div>
      ${p.notes ? `<p style="margin:12px 0 0;color:var(--muted)">${esc(p.notes)}</p>` : ''}
      ${p.chairNote ? `<p style="margin:10px 0 0"><b>${t('chairNote')}:</b> ${esc(p.chairNote)}</p>` : ''}
      ${headBtns ? `<div style="margin-top:14px">${headBtns}</div>` : ''}
    </section>
    <section>${track}<div class="waiting-line ${wl}">${esc(act && !['draft'].includes(p.stage) ? t('yourTurn') + ' — ' + t('st_' + p.stage) : waitLine(p))}</div></section>
    <section><div class="sec-title"><h3>${t('items')}</h3></div>${itemsTable(p, act)}</section>
    ${actionPanel(p, act)}
    ${invoicesSection(p, act)}
    <section><div class="sec-title"><h3>${t('history')}</h3></div><ol class="history">${[...p.history].reverse().map(h =>
      `<li><time>${fmtD(h.at)}</time><div><b>${esc(t('h_' + h.action))}</b> — ${esc(h.by)} <span class="note">(${esc(dn(h.dept))})</span>${h.note ? `<div class="note">${esc(h.note)}</div>` : ''}</div></li>`).join('')}</ol></section>
  </article>`;
}

function fileBtn(f) {
  if (!f) return '';
  return f.type === 'application/pdf'
    ? `<a class="thumb" href="${esc(f.url)}" target="_blank" rel="noopener">PDF</a>`
    : `<button class="thumb" data-act="img" data-url="${esc(f.url)}">${t('view')}</button>`;
}
function itemsTable(p, act) {
  const editQ = act && p.stage === 'purch_quote';
  const selQ = act && p.stage === 'exec_review';
  const checkMode = act && p.stage === 'store_inspect';
  const showQ = !['draft', 'purch_new'].includes(p.stage) || p.items.some(i => i.quotes.length);
  const showSel = p.items.some(i => i.selected);
  const showCheck = checkMode || !!p.storeInAt;
  const rows = p.items.map((it, n) => {
    let qcell = '';
    if (showQ) {
      const qs = it.quotes.map(q => {
        const isSel = it.selected === q.id;
        const inner = `<span class="sup">${esc(q.supplier)}</span><b class="num">${money(q.price)}</b>${fileBtn(q.file)}`;
        if (selQ) return `<div class="quote ${isSel ? 'sel' : ''}"><label><input type="radio" name="sel-${it.id}" data-select="${it.id}" value="${q.id}" ${isSel ? 'checked' : ''}>${inner}</label></div>`;
        return `<div class="quote ${isSel ? 'sel' : it.selected ? 'dim' : ''}">${isSel ? '✓ ' : ''}${inner}${editQ ? `<button class="btn sm ghost danger" data-act="delquote" data-item="${it.id}" data-q="${q.id}" aria-label="${t('remove')}">✕</button>` : ''}</div>`;
      }).join('') || `<span style="color:var(--muted);font-size:13px">${t('noQuotes')}</span>`;
      const d = S.qd[it.id] || {};
      const form = editQ ? `<div class="qform">
          <input type="text" id="qs-${it.id}" data-bind="qd.${it.id}.supplier" placeholder="${t('supplier')}" value="${esc(d.supplier)}">
          <input type="number" id="qp-${it.id}" data-bind="qd.${it.id}.price" placeholder="${t('unitPrice')}" min="0" step="0.01" value="${esc(d.price)}">
          <button class="btn sm primary" data-act="addquote" data-item="${it.id}">${t('addQuote')}</button>
          <div class="file"><span class="btn sm filebtn">📎 ${t('attachQuote')}<input type="file" accept="image/*,application/pdf" data-qfile="${it.id}"></span><span>${esc(d.fileName || '')}</span></div>
        </div>` : '';
      qcell = `<td><div class="quotes">${qs}${form}</div></td>`;
    }
    const sq = it.quotes.find(q => q.id === it.selected);
    const selCells = showSel ? `<td class="num">${sq ? money(sq.price) : '—'}</td><td class="num">${sq ? money(sq.price * it.qty) : '—'}</td>` : '';
    const chk = showCheck ? `<td>${checkMode ? `<label class="check"><input type="checkbox" data-check="${it.id}" ${it.checked ? 'checked' : ''}>${t('matched')}</label>` : it.checked ? `<span class="pill ok">${t('matched')}</span>` : '—'}</td>` : '';
    return `<tr><td class="num">${fmtN(n + 1)}</td><td><b>${esc(it.name)}</b>${it.spec ? `<div class="spec">${esc(it.spec)}</div>` : ''}</td>
      <td class="num">${fmtN(it.qty)}</td><td>${esc(it.unit)}</td>${qcell}${selCells}${chk}</tr>`;
  }).join('');
  const tot = ptotal(p);
  const span = 4 + (showQ ? 1 : 0) + 1;
  return `<div class="tbl-wrap"><table><thead><tr><th>#</th><th>${t('item')}</th><th>${t('qty')}</th><th>${t('unit')}</th>
    ${showQ ? `<th>${t('quotes')}</th>` : ''}${showSel ? `<th>${t('unitPrice')}</th><th>${t('lineTotal')}</th>` : ''}${showCheck ? `<th>${t('inspection')}</th>` : ''}</tr></thead>
    <tbody>${rows}</tbody>${showSel && tot ? `<tfoot><tr><td colspan="${span}">${t('total')}</td><td class="num">${money(tot)}</td>${showCheck ? '<td></td>' : ''}</tr></tfoot>` : ''}</table></div>`;
}

function actionPanel(p, act) {
  const acts = STAGE_ACTIONS[p.stage];
  if (!acts) return '';
  if (p.stage === 'eng_receive' && !act && (S.user.isAdmin || S.user.dept === 'eng'))
    return `<section class="actions"><p class="hint">${esc(t('hint_eng_other', { n: p.engineerName }))}</p></section>`;
  if (p.stage === 'rejected' && !(S.user.isAdmin || S.user.dept === 'tech')) return '';
  if (!act && p.stage !== 'rejected') return '';
  const ad = S.ad;
  let extra = '';
  if (p.stage === 'chair') extra = `<label class="field" style="flex:1 1 260px"><span>${t('note')}</span><textarea id="ad-note" data-bind="ad.note">${esc(ad.note || '')}</textarea></label>`;
  if (p.stage === 'acc_work') extra = `<label class="field" style="flex:0 1 220px"><span>${t('amount')}</span><input type="number" id="ad-amount" min="0" step="0.01" data-bind="ad.amount" value="${esc(ad.amount ?? ptotal(p))}"></label>
    <label class="field" style="flex:1 1 240px"><span>${t('note')}</span><input type="text" id="ad-note" data-bind="ad.note" value="${esc(ad.note || '')}"></label>`;
  const btns = acts.map(a => {
    const cls = a === 'reject' ? 'btn danger solid' : 'btn primary';
    return `<button class="${cls}" data-act="do" data-a="${a}" data-id="${p.id}" ${S.busy ? 'disabled' : ''}>${t('a_' + a)}</button>`;
  }).join('');
  return `<section class="actions"><p class="hint">${t('hint_' + p.stage)}</p><div class="row">${extra}${btns}</div></section>`;
}

function invoicesSection(p, act) {
  const editable = act && p.stage === 'purch_buying';
  if (!p.invoices.length && !editable) return '';
  const list = p.invoices.map(f => `<div class="fileitem">🧾 <span>${esc(f.name)}</span>${fileBtn(f)}${editable ? `<button class="btn sm ghost danger" data-act="delinv" data-f="${f.id}">✕</button>` : ''}</div>`).join('');
  return `<section><div class="sec-title"><h3>${t('invoices')}</h3>${editable ? `<span class="btn sm filebtn">📎 ${t('uploadInvoice')}<input type="file" accept="image/*,application/pdf" data-invfile="${p.id}"></span>` : ''}</div>
    <div class="files">${list || `<span style="color:var(--muted)">${t('noInvoices')}</span>`}</div></section>`;
}

function newView() {
  const d = S.draft;
  if (!d.branch) d.branch = defBranch();
  const engs = S.users.filter(u => u.dept === 'eng' && u.active && (u.branch === d.branch || u.branch === 'all'));
  if (d.engineerId && !engs.some(u => u.id === d.engineerId)) d.engineerId = '';
  const rows = d.items.map((it, i) => `<div class="item-row">
      <span class="idx">${fmtN(i + 1)}</span>
      <input class="nm" type="text" id="it-n-${i}" data-bind="draft.items.${i}.name" placeholder="${t('item')}" value="${esc(it.name)}">
      <input type="number" id="it-q-${i}" data-bind="draft.items.${i}.qty" placeholder="${t('qty')}" min="0" step="any" value="${esc(it.qty)}">
      <input type="text" id="it-u-${i}" data-bind="draft.items.${i}.unit" placeholder="${t('unit')}" value="${esc(it.unit)}">
      <input class="sp" type="text" id="it-s-${i}" data-bind="draft.items.${i}.spec" placeholder="${t('spec')}" value="${esc(it.spec)}">
      <button class="btn sm ghost danger" data-act="rmitem" data-i="${i}" ${d.items.length < 2 ? 'disabled' : ''} aria-label="${t('remove')}">✕</button>
    </div>`).join('');
  return `<div class="page-head"><div><h1>${S.editId ? t('editTitle') : t('newTitle')}</h1><p>${t('newSub')}</p></div></div>
  <form class="panel box" data-form="project">
    <div class="form-grid">
      ${allBr() ? `<label class="field"><span>${t('branch')}</span><select id="pbr" data-bind="draft.branch" data-live="1" ${S.editId ? 'disabled' : ''}>${BRANCHES.map(b => `<option value="${b}" ${b === d.branch ? 'selected' : ''}>${bn(b)}</option>`).join('')}</select></label>` : ''}
      <label class="field"><span>${t('projectName')}</span><input type="text" id="pn" data-bind="draft.name" value="${esc(d.name)}" required></label>
      <label class="field"><span>${t('engineer')}</span><select id="pe" data-bind="draft.engineerId" required>
        <option value="">${t('chooseEng')}</option>${engs.map(u => `<option value="${u.id}" ${u.id === d.engineerId ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select></label>
    </div>
    ${engs.length ? '' : `<div class="waiting-line">${t('noEngineers')}</div>`}
    <div class="items-edit"><div class="item-row item-head"><span>#</span><span>${t('item')}</span><span>${t('qty')}</span><span>${t('unit')}</span><span>${t('spec')}</span><span></span></div>${rows}
      <div><button type="button" class="btn sm" data-act="additem">+ ${t('addItem')}</button></div></div>
    <label class="field"><span>${t('notes')}</span><textarea id="pnotes" data-bind="draft.notes">${esc(d.notes)}</textarea></label>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type="submit" class="btn primary" data-send="1" ${S.busy ? 'disabled' : ''}>${t('sendNow')}</button>
      <button type="button" class="btn" data-act="savedraft" ${S.busy ? 'disabled' : ''}>${t('saveDraft')}</button>
      ${S.editId ? `<button type="button" class="btn ghost" data-act="canceledit">${t('cancel')}</button>` : ''}
    </div>
  </form>`;
}

function stockView() {
  const sw = `<div class="subtabs">${['general', 'byProj'].map(k => `<button class="${S.skView === k ? 'on' : ''}" data-act="skv" data-v="${k}">${t('sk_' + k)}</button>`).join('')}</div>`;
  return sw + (S.skView === 'general' ? generalStockView() : projStockView());
}
function projStockView() {
  const f = S.stockFilter || 'in';
  const map = { store_ship: 'in', eng_receive: 'sending', closed: 'delivered' };
  const all = S.projects.filter(p => p.storeInAt && map[p.stage]);
  const list = all.filter(p => f === 'all' || map[p.stage] === f);
  const inStock = all.filter(p => p.stage === 'store_ship');
  const val = inStock.reduce((s, p) => s + ptotal(p), 0);
  const pill = { in: 'wait', sending: 'mine', delivered: 'ok' };
  const groups = list.map(p => {
    const st = map[p.stage];
    const sb = isStore();
    return `<div class="panel" style="overflow:hidden">
      <div class="group-title"><span>${esc(p.name)} <span class="eyebrow">${esc(p.number)}</span></span><span class="pill ${pill[st]}">${t('s_' + st)}</span></div>
      <div class="tbl-wrap"><table><thead><tr><th>${t('item')}</th>${sb ? `<th>${t('qty')}</th>` : ''}<th>${t('unit')}</th><th>${t('supplier')}</th>${sb ? `<th>${t('unitPrice')}</th><th>${t('lineTotal')}</th>` : ''}</tr></thead>
      <tbody>${p.items.map(it => { const q = it.quotes.find(q => q.id === it.selected); return `<tr><td>${esc(it.name)}</td>${sb ? `<td class="num">${fmtN(it.qty)}</td>` : ''}<td>${esc(it.unit)}</td><td>${esc(q?.supplier || '—')}</td>${sb ? `<td class="num">${q ? money(q.price) : '—'}</td><td class="num">${q ? money(q.price * it.qty) : '—'}</td>` : ''}</tr>`; }).join('')}</tbody></table></div>
      <div style="padding:8px 14px;font-size:13px;color:var(--muted)">${t('engineer')}: ${esc(p.engineerName)} · ${fmtD(p.storeInAt)}</div></div>`;
  }).join('');
  return `<div class="page-head"><div><h1>${t('stockTitle')}</h1><p>${t('stockSub')}</p></div></div>
    ${isStore() ? `<div class="stat-row" style="margin-bottom:16px">
      <div class="stat"><span>${t('projectsInStock')}</span><b>${fmtN(inStock.length)}</b></div>
      <div class="stat"><span>${t('stockValue')}</span><b>${money(val)}</b></div>
      <div class="stat"><span>${t('s_sending')}</span><b>${fmtN(all.filter(p => p.stage === 'eng_receive').length)}</b></div>
    </div>` : ''}
    <div class="filters" style="margin-bottom:12px">${['in', 'sending', 'delivered', 'all'].map(k => `<button class="chip ${f === k ? 'on' : ''}" data-act="sfilter" data-v="${k}">${k === 'all' ? t('f_all') : t('s_' + k)}</button>`).join('')}</div>
    <div style="display:grid;gap:14px">${groups || `<div class="empty"><b>${t('noStock')}</b>${t('noStockSub')}</div>`}</div>`;
}

function staffView() {
  const uf = S.uf;
  if (!uf.branch) uf.branch = defBranch();
  const brOpts = allBr() ? [...BRANCHES, 'all'] : [S.user.branch];
  const byDept = DEPTS.map(d => {
    const us = S.users.filter(u => u.dept === d && (!S.branch || u.branch === S.branch || u.branch === 'all'));
    if (!us.length) return '';
    return `<tbody><tr><td colspan="6" style="background:var(--sunk);font-weight:600">${dn(d)} <span class="count" style="background:var(--sunk);color:var(--muted)">${fmtN(us.length)}</span></td></tr>
      ${us.map(u => `<tr>
        <td><b>${esc(u.name)}</b>${u.isAdmin ? ` <span class="pill mine">${t('admin')}</span>` : ''}</td>
        <td class="mono">${esc(u.username)}</td>
        <td>${u.isAdmin || !allBr() ? bn(u.branch) : `<select id="ub-${u.id}" data-change="ubranch" data-id="${u.id}" style="width:auto">${[...BRANCHES, 'all'].map(x => `<option value="${x}" ${x === u.branch ? 'selected' : ''}>${bn(x)}</option>`).join('')}</select>`}</td>
        <td>${u.isAdmin ? dn(u.dept) : `<select id="ud-${u.id}" data-change="udept" data-id="${u.id}" style="width:auto">${DEPTS.map(x => `<option value="${x}" ${x === u.dept ? 'selected' : ''}>${dn(x)}</option>`).join('')}</select>`}</td>
        <td><span class="pill ${u.active ? 'ok' : 'draft'}">${u.active ? t('active') : t('inactive')}</span></td>
        <td><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <input type="password" id="rp-${u.id}" data-bind="rp.${u.id}" placeholder="${t('resetPw')}" style="width:150px">
          <button class="btn sm" data-act="setpw" data-id="${u.id}">${t('setPw')}</button>
          ${u.isAdmin ? '' : `<button class="btn sm" data-act="toggle" data-id="${u.id}">${u.active ? t('deactivate') : t('activate')}</button>
            ${S.confirm === 'u-' + u.id ? `<button class="btn sm danger solid" data-act="deluser" data-id="${u.id}">${t('confirmDel')}</button>` : `<button class="btn sm danger" data-act="confirm" data-v="u-${u.id}">${t('del')}</button>`}`}
        </div></td></tr>`).join('')}</tbody>`;
  }).join('');
  return `<div class="page-head"><div><h1>${t('staffTitle')}</h1><p>${t('staffSub')}</p></div></div>
    <form class="panel box" data-form="user" style="margin-bottom:18px"><h3>${t('addEmp')}</h3>
      <div class="form-grid">
        <label class="field"><span>${t('fullName')}</span><input type="text" id="uf-n" data-bind="uf.name" value="${esc(uf.name)}" required></label>
        <label class="field"><span>${t('username')}</span><input type="text" id="uf-u" data-bind="uf.username" value="${esc(uf.username)}" autocomplete="off" required></label>
        <label class="field"><span>${t('password')}</span><input type="password" id="uf-p" data-bind="uf.password" autocomplete="new-password" required minlength="6"></label>
        <label class="field"><span>${t('branch')}</span><select id="uf-b" data-bind="uf.branch">${brOpts.map(x => `<option value="${x}" ${x === uf.branch ? 'selected' : ''}>${bn(x)}</option>`).join('')}</select></label>
        <label class="field"><span>${t('dept')}</span><select id="uf-d" data-bind="uf.dept">${DEPTS.map(x => `<option value="${x}" ${x === uf.dept ? 'selected' : ''}>${dn(x)}</option>`).join('')}</select></label>
      </div>
      <div><button class="btn primary" type="submit">${t('addEmp')}</button></div></form>
    <div class="panel tbl-wrap"><table><thead><tr><th>${t('fullName')}</th><th>${t('username')}</th><th>${t('branch')}</th><th>${t('dept')}</th><th>${t('status')}</th><th></th></tr></thead>${byDept}</table></div>`;
}

function accountView() {
  return `<div class="page-head"><div><h1>${t('accountTitle')}</h1><p>${esc(S.user.name)} · <span class="mono">${esc(S.user.username)}</span> · ${dn(S.user.dept)}</p></div></div>
    <form class="panel box" data-form="pw" style="max-width:420px">
      <label class="field"><span>${t('currentPw')}</span><input type="password" id="pw-c" data-bind="pw.current" autocomplete="current-password" required></label>
      <label class="field"><span>${t('newPw')}</span><input type="password" id="pw-n" data-bind="pw.next" autocomplete="new-password" minlength="6" required></label>
      <div><button class="btn primary" type="submit">${t('changePw')}</button></div></form>`;
}

// ---------------- data ----------------
async function refresh(soft) {
  // before the default password is changed the server allows only the account page
  if (S.user && S.user.mustChange) { S.tab = 'account'; render(soft); return; }
  try {
    const [{ projects }, { users }, { stock }, { withdrawals }] = await Promise.all([api('GET', '/api/projects'), api('GET', '/api/users'), api('GET', '/api/stock'), api('GET', '/api/withdrawals')]);
    const inB = x => !S.branch || x.branch === S.branch;
    S.projects = projects.filter(inB); S.users = users; S.stock = stock.filter(inB); S.withdrawals = withdrawals.filter(inB);
  } catch {}
  render(soft);
}
function upsert(p) {
  const i = S.projects.findIndex(x => x.id === p.id);
  if (i >= 0) S.projects[i] = p; else S.projects.unshift(p);
}
async function run(fn) {
  if (S.busy) return;
  S.busy = true;
  try { await fn(); } catch (e) { toast(errMsg(e), true); }
  finally { S.busy = false; render(); }
}

// ---------------- events ----------------
document.addEventListener('input', e => {
  const el = e.target, b = el.dataset.bind;
  if (!b) return;
  setPath(S, b, el.value);
  if (el.dataset.live) render();
});
document.addEventListener('change', async e => {
  const el = e.target;
  if (el.dataset.bind && el.tagName === 'SELECT') setPath(S, el.dataset.bind, el.value);
  if (el.dataset.change === 'as') { S.as = el.value; S.sel = null; S.tab = el.value === 'it' ? 'track' : 'inbox'; return render(); }
  if (el.dataset.change === 'branch') { S.branch = el.value; try { localStorage.setItem('omega-branch', S.branch); } catch {} S.sel = null; S.wdSel = null; S.draft.branch = ''; S.lblSel = []; return refresh(); }
  if (el.dataset.change === 'ubranch') return run(async () => { await api('PATCH', '/api/users/' + el.dataset.id, { branch: el.value }); await refresh(); toast(t('saved')); });
  if (el.dataset.change === 'udept') return run(async () => { await api('PATCH', '/api/users/' + el.dataset.id, { dept: el.value }); await refresh(); toast(t('saved')); });
  if (el.dataset.qfile) {
    const f = el.files[0]; if (!f) return;
    S.qd[el.dataset.qfile] = { ...(S.qd[el.dataset.qfile] || {}), file: f, fileName: f.name };
    return render();
  }
  if (el.dataset.select) {
    const p = S.projects.find(x => x.id === S.sel);
    return run(async () => { const r = await api('POST', `/api/projects/${p.id}/items/${el.dataset.select}/select`, { quoteId: el.value }); upsert(r.project); });
  }
  if (el.dataset.check) {
    const p = S.projects.find(x => x.id === S.sel);
    return run(async () => { const r = await api('POST', `/api/projects/${p.id}/items/${el.dataset.check}/check`, { checked: el.checked }); upsert(r.project); });
  }
  if (el.dataset.invfile) {
    const f = el.files[0]; if (!f) return;
    toast(t('uploading'));
    return run(async () => { const file = await readFile(f); const r = await api('POST', `/api/projects/${el.dataset.invfile}/invoices`, { file }); upsert(r.project); toast(t('saved')); });
  }
});
document.addEventListener('submit', e => {
  const form = e.target.dataset.form; if (!form) return;
  e.preventDefault();
  if (form === 'login') {
    const username = $('#lu').value, password = $('#lp').value;
    api('POST', '/api/login', { username, password }).then(async r => {
      S.user = r.user; S.serverVersion = r.version; S.login = {}; S.as = null; S.tab = r.user.dept === 'it' ? 'track' : 'inbox'; S.sel = null; S.wdSel = null; S.wdFilter = 'act'; S.wdNew = null; S.lblSel = []; S.skQ = ''; S.branch = ''; S.draft = newDraft(); S.uf = { dept: 'tech' };
      await refresh();
      if (password === 'admin123' && !S.user.mustChange) toast(t('defaultPw'), true);
    }).catch(err => { S.login.err = errMsg(err); S.login.username = username; render(); });
  }
  if (form === 'project') saveProject(true);
  if (form === 'user') run(async () => {
    await api('POST', '/api/users', S.uf); S.uf = { dept: S.uf.dept, branch: S.uf.branch }; await refresh(); toast(t('added'));
  });
  if (form === 'pw') run(async () => { await api('POST', '/api/me/password', S.pw); S.pw = {}; toast(t('pwChanged')); if (S.user.mustChange) { S.user.mustChange = false; S.tab = S.user.dept === 'it' ? 'track' : 'inbox'; await refresh(); } });
});
function saveProject(sendIt) {
  run(async () => {
    const d = S.draft;
    const body = { ...d, items: d.items.filter(i => String(i.name).trim() || i.qty), send: sendIt };
    const r = S.editId ? await api('PUT', '/api/projects/' + S.editId, body) : await api('POST', '/api/projects', body);
    upsert(r.project); S.draft = newDraft(); S.editId = null; S.sel = r.project.id; S.tab = 'track'; S.filter = sendIt ? 'active' : 'draft';
    toast(t('saved'));
  });
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  const P = () => S.projects.find(x => x.id === (el.dataset.id || S.sel));
  switch (a) {
    case 'lang': lang = lang === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('omega-lang', lang); } catch {} return render();
    case 'logout': return api('POST', '/api/logout').finally(() => { S.user = null; S.projects = []; render(); });
    case 'tab': S.tab = el.dataset.v; S.confirm = null; return render();
    case 'filter': S.filter = el.dataset.v; return render();
    case 'sfilter': S.stockFilter = el.dataset.v; return render();
    case 'sel': S.sel = el.dataset.id; S.ad = {}; S.confirm = null; render();
      if (window.innerWidth <= 900) document.querySelector('.detail')?.scrollIntoView({ behavior: 'smooth' });
      return;
    case 'confirm': S.confirm = el.dataset.v || null; return render();
    case 'img': { const lb = $('#lightbox'); lb.querySelector('img').src = el.dataset.url; lb.hidden = false; return; }
    case 'lb-close': $('#lightbox').hidden = true; return;
    case 'additem': S.draft.items.push({ name: '', qty: '', unit: '', spec: '' }); render(); document.getElementById('it-n-' + (S.draft.items.length - 1))?.focus(); return;
    case 'rmitem': S.draft.items.splice(+el.dataset.i, 1); return render();
    case 'savedraft': return saveProject(false);
    case 'canceledit': S.editId = null; S.draft = newDraft(); S.tab = 'track'; return render();
    case 'edit': { const p = P(); S.editId = p.id; S.draft = { branch: p.branch, name: p.name, engineerId: p.engineerId, notes: p.notes || '', items: p.items.map(i => ({ name: i.name, qty: i.qty, unit: i.unit, spec: i.spec })) }; S.tab = 'new'; return render(); }
    case 'delproj': return run(async () => { await api('DELETE', '/api/projects/' + el.dataset.id); S.projects = S.projects.filter(x => x.id !== el.dataset.id); S.sel = null; S.confirm = null; });
    case 'do': {
      const p = P(); const action = el.dataset.a; const body = { action };
      if (p.stage === 'chair') body.note = S.ad.note || '';
      if (p.stage === 'acc_work') { body.amount = Number(S.ad.amount ?? ptotal(p)); body.note = S.ad.note || ''; }
      return run(async () => {
        const r = await api('POST', `/api/projects/${p.id}/action`, body); upsert(r.project); S.ad = {};
        if (action === 'reopen') { S.editId = p.id; S.draft = { branch: p.branch, name: p.name, engineerId: p.engineerId, notes: p.notes || '', items: p.items.map(i => ({ name: i.name, qty: i.qty, unit: i.unit, spec: i.spec })) }; S.tab = 'new'; }
        toast(t('h_' + action));
      });
    }
    case 'addquote': {
      const p = P(), id = el.dataset.item, d = S.qd[id] || {};
      if (!String(d.supplier || '').trim()) return toast(t('err_supplier'), true);
      if (!(Number(d.price) > 0)) return toast(t('err_price'), true);
      if (d.file) toast(t('uploading'));
      return run(async () => {
        const file = d.file ? await readFile(d.file) : null;
        const r = await api('POST', `/api/projects/${p.id}/items/${id}/quotes`, { supplier: d.supplier, price: Number(d.price), file });
        upsert(r.project); S.qd[id] = {};
      });
    }
    case 'delquote': { const p = P(); return run(async () => { const r = await api('DELETE', `/api/projects/${p.id}/items/${el.dataset.item}/quotes/${el.dataset.q}`); upsert(r.project); }); }
    case 'delinv': { const p = P(); return run(async () => { const r = await api('DELETE', `/api/projects/${p.id}/invoices/${el.dataset.f}`); upsert(r.project); }); }
    case 'setpw': { const pw = S.rp?.[el.dataset.id]; return run(async () => { await api('PATCH', '/api/users/' + el.dataset.id, { password: pw || '' }); if (S.rp) S.rp[el.dataset.id] = ''; toast(t('saved')); }); }
    case 'toggle': { const u = S.users.find(x => x.id === el.dataset.id); return run(async () => { await api('PATCH', '/api/users/' + u.id, { active: !u.active }); await refresh(); }); }
    case 'deluser': return run(async () => { const r = await api('DELETE', '/api/users/' + el.dataset.id); S.confirm = null; await refresh(); toast(r.deactivated ? t('deactivated') : t('saved')); });
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').hidden = true; });
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.currentTarget.hidden = true; });

// ---------------- boot ----------------
(async function boot() {
  try { const r = await api('GET', '/api/me'); S.user = r.user; S.serverVersion = r.version; S.tab = r.user.dept === 'it' ? 'track' : 'inbox'; await refresh(); } catch {}
  S.loaded = true; render();
  setInterval(() => { if (S.user && !S.busy) refresh(true); }, 15000);
  window.addEventListener('resize', () => {});
})();
