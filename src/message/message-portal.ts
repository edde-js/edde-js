import {Inject} from "../container";
import {MessageBus} from "./message-bus";
import {Message} from "./message";
import {MessageServiceConfig} from "./types";
import {Packet} from "./packet";
import {ToString} from "../utils";

@ToString('edde/message/message-portal')
export class MessagePortal {
	@Inject(MessageBus)
	protected messageBus: MessageBus;
	@Inject(MessageServiceConfig)
	protected config: MessageServiceConfig;
	protected packet: Packet;
	protected timeoutId: any;

	/**
	 * send a message to "other side"; there could be some timeout before it's actually sent
	 *
	 * @param message
	 */
	public send(message: Message): MessagePortal {
		this.packet.message(message);
		if (this.packet.messages().getCount() >= this.config.buffer) {
			this.request();
			return this;
		}
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => this.request(), this.config.deffer);
		return this;
	}

	protected request() {
		const content = JSON.stringify(this.packet.export());
		const xmlHttpRequest = new XMLHttpRequest();
		try {
			let timeoutId: any = null;
			xmlHttpRequest.onreadystatechange = () => {
				switch (xmlHttpRequest.readyState) {
					/**
					 * UNSENT
					 *
					 * The XMLHttpRequest client has been created, but the open() method
					 * hasn't been called yet.
					 */
					case 0:
						break;
					/**
					 * OPENED
					 *
					 * open() method has been invoked. During this state, the request headers
					 * can be set using the setRequestHeader() method and the send() method can
					 * be called which will initiate the fetch.
					 */
					case 1:
						this.packet = this.messageBus.createPacket();
						if (content) {
							xmlHttpRequest.setRequestHeader('Content-Type', 'application/json')
						}
						xmlHttpRequest.setRequestHeader('Accept', 'application/json');
						timeoutId = setTimeout(() => {
							xmlHttpRequest.abort();
						}, this.config.timeout * 1000);
						break;
					/**
					 * HEADERS_RECEIVED
					 *
					 * send() has been called, and headers and status are available.
					 */
					case 2:
						break;
					/**
					 * LOADING
					 *
					 * Response's body is being received. If responseType is "text" or
					 * empty string, responseText will have the partial text response as it loads.
					 */
					case 3:
						clearTimeout(timeoutId);
						timeoutId = null;
						break;
					/**
					 * DONE
					 *
					 * The fetch operation is complete. This could mean that either the
					 * data transfer has been completed successfully or failed.
					 */
					case 4:
						try {
							if (xmlHttpRequest.status >= 200 && xmlHttpRequest.status <= 299) {
								this.messageBus.packet(this.messageBus.import(JSON.parse(xmlHttpRequest.response)));
							} else if (xmlHttpRequest.status >= 400 && xmlHttpRequest.status <= 499) {
							} else if (xmlHttpRequest.status >= 500 && xmlHttpRequest.status <= 599) {
							}
						} catch (e) {
							throw e;
						}
						break;
				}
			};
			xmlHttpRequest.open('POST', this.config.url, true);
			xmlHttpRequest.send(content);
		} catch (e) {
			throw e;
		}
	}

	protected init() {
		this.packet = this.messageBus.createPacket();
	}
}
