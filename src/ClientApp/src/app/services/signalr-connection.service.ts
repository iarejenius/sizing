import * as signalR from '@aspnet/signalr';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SignalRConnection {

    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/hub")
            .build();
    }

    start(): Promise<void> {
        return this.connection.start();
    }

    stop(): Promise<void> {
        return this.connection.stop();
    }

    on(methodName: string, newMethod: (...args: any[]) => void): void {
        return this.connection.on(methodName, newMethod);
    }

    off(methodName: string, method: (...args: any[]) => void): void {
        return this.connection.off(methodName, method);
    }

    send(methodName: string, ...args: any[]): Promise<void> {
        return this.connection.send(methodName, ...args);
    }
}