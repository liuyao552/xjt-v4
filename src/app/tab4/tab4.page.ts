import { AlertController } from '@ionic/angular';
import { UserData } from '../services/user-data';
import { NgZone, Component, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import 'moment/min/locales';
moment.locale('zh-cn');
import { BdageProvider } from '../services/bdage/bdage';
import * as $ from 'jquery';
import { Tab4Service } from './tab4.service';
import { AppConfig, IAppConfig } from '../config';

@Component({
	selector: 'app-tab4',
	templateUrl: 'tab4.page.html',
	styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
	config: IAppConfig;
	datas: any;
	pageNo: number;
	searching: boolean;
	infiniteScrollObj: any;
	search_statusType: any;
	hasNext: any;
	cancelSearchbar: any;
	projectId: any;
	nextPage: any;
	editable: boolean;
	checkArr: any;
	isselectAll: boolean;
	again: boolean;
	loaded: boolean;
	pullText: boolean;
	dataTemp: any;
	isPush: any;
	pass: any;
	newsDatas: any;
	today: any;
	noMessages: boolean;
	sumCount: number;
	waterGage: any;

	constructor(
		private ref: ChangeDetectorRef,
		private tab4Service: Tab4Service,
		private userData: UserData, public alertCtrl: AlertController,
		private bdageProvider: BdageProvider, ) {
		this.datas = [];
		this.pageNo = 1;
		this.searching = false;
		this.projectId = this.userData.getProjectId();
		this.nextPage = '';
		this.editable = false;
		this.checkArr = [];
		this.isselectAll = false;
		this.again = false;
		this.loaded = false;
		this.dataTemp = {};
		this.isPush = true;
		this.pass = false;
		this.config = AppConfig;
	}
	ionViewWillEnter() {
		if ($('.tab-button').eq(1).css('display') === 'none') {
			$('.tab-button').eq(1).css('display', 'none');
			$('.tab-button').eq(2).css('display', 'block');
		} else {
			$('.tab-button').eq(1).css('display', 'block');
			$('.tab-button').eq(2).css('display', 'none');
		}
		this.getSumCount();
		this.bdageProvider.loadMessageCount();
		this.projectId = this.userData.getProjectId();
	}

	ionViewWillLeave() {
		localStorage.removeItem('isMessages');
	}
	ionViewDidLoad() {
		localStorage.setItem('messageref', 'true');
	}
	// 获取角标数据
	// getData(){
	pagination(event) {
		this.tab4Service.getMessages()
			.subscribe(
				response => {
					this.loaded = true;
					// 页面脏监测
					this.ref.markForCheck();
					this.ref.detectChanges();
					this.bdageProvider.loadMessageCount();
					this.newsDatas = response.ret;
					this.noMessages = true;
					this.newsDatas.map(item => {
						if (item.content) {
							this.noMessages = false;
						}
					});
				},
				err => {
					if (event) {
						event.complete();
					}
					throw err;
				},
				() => {
					console.log('pagination Complete');
					if (event) {
						event.complete();
					}
				}
			);
	}
	// 打开消息列表
	messagesList(i) {
		// this.nav.push('MessagesListPage', { 'type': i });
	}

	ionViewDidEnter() {
		const messageref = localStorage.getItem('messageref');
		if (messageref === 'true') {
			this.doRefresh(null);
		} else {
			localStorage.setItem('messageref', 'true');
		}
		console.log('ionViewDidEnter...');
		if (this.userData.popRefreshLevel()) {
		}
		if (this.infiniteScrollObj) {
			this.infiniteScrollObj._highestY = 0;
			this.infiniteScrollObj._lastCheck = 0;
		}
		localStorage.setItem('isMessages', 'true');
		this.bdageProvider.loadMessageCount();
	}
	getSumCount() {
		if (this.userData.getUser() && this.userData.getProjectId()) {
			this.tab4Service.getMessagesCount()
				.subscribe(
					response => {
						this.loaded = true;
						this.sumCount = response;
					},
					err => {
						throw err;
					},
					() => {
						console.log('load messageCount Complete');
					}
				);
		}
	}

	changeStatusType(status) {
		this.search_statusType = status;
		this.onReload(null);
	}
	// 下拉刷新
	doRefresh(refresher) {
		console.log('doRefresh...' + refresher);
		this.onReload(refresher);
	}

	onReload(event) {
		if (this.infiniteScrollObj) {
			this.infiniteScrollObj._highestY = 0;
			this.infiniteScrollObj._lastCheck = 0;
		}
		this.pagination(event);
	}
}
