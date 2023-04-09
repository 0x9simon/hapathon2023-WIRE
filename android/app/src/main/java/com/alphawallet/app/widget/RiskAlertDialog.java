package com.alphawallet.app.widget;

import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.content.res.AppCompatResources;

import com.alphawallet.app.R;
import com.alphawallet.app.entity.RiskCallback;
import com.alphawallet.app.entity.RiskInfo;
import com.alphawallet.app.entity.StandardFunctionInterface;
import com.alphawallet.app.ui.widget.adapter.RiskInfoAdapter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.reactivex.annotations.NonNull;

public class RiskAlertDialog extends ActionSheet implements StandardFunctionInterface {

    private final RiskCallback riskCallback;

    private final ZeroUAttackView zeroUAttackView;

    private final FunctionButtonBar functionButtonBar;

    public RiskAlertDialog(@NonNull Activity activity, RiskCallback riskCallback) {
        super(activity);
        final View view = View.inflate(getContext(), R.layout.dialog_risk_alert, null);
        setContentView(view);
        zeroUAttackView = findViewById(R.id.zero_u_attack);
        zeroUAttackView.setAddrs(
                "0x44b6a393560f9146e7556f0894b4ce76875b92f4",
                "0xeb40342d0f7a5a0aacefbb9a32c9d2e22184683d",
                "0xeb40342d42967a70066efdb498c69fd8b184683d"
        );
        functionButtonBar = findViewById(R.id.layoutButtons);
        final List<Integer> functions = new ArrayList<>(Arrays.asList(R.string.action_cancel, R.string.continue_anyway));
        functionButtonBar.setupFunctions(this, functions);
        functionButtonBar.revealButtons();
        this.riskCallback = riskCallback;
    }

    @Override
    public void handleClick(String action, int actionId) {
        if (actionId == R.string.action_cancel) {
            riskCallback.onRiskCancel();
            dismiss();
        } else if (actionId == R.string.continue_anyway) {
            dismiss();
            riskCallback.onRiskConfirm();
        }
    }
}
