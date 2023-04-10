package com.alphawallet.app.ui.widget.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.alphawallet.app.R;

import java.util.List;
import java.util.Objects;

public class RiskInfoAdapter extends ArrayAdapter<String> {

    public RiskInfoAdapter(@NonNull Context context, List<String> riskInfoList) {
        super(context, 0, riskInfoList);
    }

    @Override
    public boolean isEnabled(int position) {
        return false;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        if (Objects.isNull(convertView)) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.item_risk_alert, parent, false);
        }
        TextView riskInfo = convertView.findViewById(R.id.risk_info);
        riskInfo.setText(getItem(position));
        return convertView;
    }
}
