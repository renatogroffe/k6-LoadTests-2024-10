import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { jUnit, textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';

export let options = {
    thresholds: {
        http_req_failed: ['rate < 0.05']
    }    
};

export default function () {
    const session = new Httpx({ });

    const authEndpoint = '#{AuthEndpoint}#';
    const testEndpoint = '#{GetTestEndpoint}#';
    const subscriptionKeyAPIM = '#{SubscriptionKeyAPIM}#';
    const clientId = '#{ClientId}#';
    const clientSecret = '#{ClientSecret}#';
    const scopeAppRegistration = '#{ScopeAppRegistration}#';

    session.addHeader('User-Agent', 'k6-loadtest-script');
    const respAuthentication = session.post(authEndpoint, {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scopeAppRegistration
    });
    check(respAuthentication, {
      'autenticacao Microsoft Entra ID OK 200': (r) => r.status === 200,
    });

    const token = JSON.parse(respAuthentication.body).access_token;
    
    // Testes durante implementação (manter comentado para execução do load test)
    //console.log('Token do Entra ID: ' + token);

    const params = {
        headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKeyAPIM,
            "User-Agent": "k6-loadtest-script",
            'Authorization': `Bearer ${token}`
        },
      };
    // Testes durante implementação (manter comentado para execução do load test)
    //console.log(JSON.stringify(params));
    var resp = http.get(testEndpoint, params);
    check(resp, {
        'endpoint GET OK 200': (r) => r.status === 200,
    });

    // Testes durante implementação (manter comentado para execução do load test)
    //console.log(JSON.stringify(resp.body));
    
    sleep(1);
}

export function handleSummary(data) {
    return {
      "loadtests-results.html": htmlReport(data),
      "loadtests-results.xml": jUnit(data),
      stdout: textSummary(data, { indent: " ", enableColors: true })
    };
}