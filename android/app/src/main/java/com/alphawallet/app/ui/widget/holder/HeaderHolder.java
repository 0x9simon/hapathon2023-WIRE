package com.alphawallet.app.ui.widget.holder;

import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SwitchCompat;

import com.alphawallet.app.R;
import com.alphawallet.app.entity.tokendata.TokenGroup;
import com.alphawallet.app.repository.SharedPreferenceRepository;

public class HeaderHolder extends BinderViewHolder<TokenGroup> {
    public static final int VIEW_TYPE = 2022;

    private final TextView title;

    private final SwitchCompat riskSwitch;

    private final SharedPreferenceRepository sharedPreferenceRepository;

    @Override
    public void bind(@Nullable TokenGroup data, @NonNull Bundle addition) {
        title.setText(groupToHeader(data));
    }

    private String groupToHeader(TokenGroup data)
    {
        if (data == null) return getString(R.string.assets);
        switch (data)
        {
            case ASSET:
            default:
                return getString(R.string.assets);
            case DEFI:
                return getString(R.string.defi_header);
            case GOVERNANCE:
                return getString(R.string.governance_header);
            case NFT:
                return getString(R.string.collectibles_header);
            case SPAM:
                return getString(R.string.spam_header);
        }
    }

    public HeaderHolder(int res_id, ViewGroup parent) {
        super(res_id, parent);
        title = findViewById(R.id.title);
        riskSwitch = findViewById(R.id.switch_risk);
        sharedPreferenceRepository = new SharedPreferenceRepository(getContext());
        riskSwitch.setChecked(sharedPreferenceRepository.isRiskCheckOn());
        riskSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                sharedPreferenceRepository.setRiskCheckOn(isChecked);
                Toast.makeText(getContext(), isChecked ? R.string.wire_on : R.string.wire_off, Toast.LENGTH_LONG).show();
            }
        });
    }
}
